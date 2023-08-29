import { Configuration } from '@sourcegraph/cody-shared/src/configuration'
import { FeatureFlag, FeatureFlagProvider } from '@sourcegraph/cody-shared/src/experimentation/FeatureFlagProvider'
import { SourcegraphNodeCompletionsClient } from '@sourcegraph/cody-shared/src/sourcegraph-api/completions/nodeClient'

import { debug } from '../../log'

import { createProviderConfig as createAnthropicProviderConfig } from './anthropic'
import { ProviderConfig } from './provider'
import { createProviderConfig as createUnstableAzureOpenAiProviderConfig } from './unstable-azure-openai'
import { createProviderConfig as createUnstableCodeGenProviderConfig } from './unstable-codegen'
import { createProviderConfig as createUnstableFireworksProviderConfig } from './unstable-fireworks'
import { createProviderConfig as createUnstableHuggingFaceProviderConfig } from './unstable-huggingface'

export async function createProviderConfig(
    config: Configuration,
    completionsClient: SourcegraphNodeCompletionsClient,
    featureFlagProvider?: FeatureFlagProvider
): Promise<ProviderConfig | null> {
    const provider = await resolveDefaultProvider(config.autocompleteAdvancedProvider, featureFlagProvider)
    switch (provider) {
        case 'unstable-codegen': {
            if (config.autocompleteAdvancedServerEndpoint !== null) {
                return createUnstableCodeGenProviderConfig({
                    serverEndpoint: config.autocompleteAdvancedServerEndpoint,
                })
            }

            debug(
                'createProviderConfig',
                'Provider `unstable-codegen` can not be used without configuring `cody.autocomplete.advanced.serverEndpoint`.'
            )
            return null
        }
        case 'unstable-huggingface': {
            if (config.autocompleteAdvancedServerEndpoint !== null) {
                return createUnstableHuggingFaceProviderConfig({
                    serverEndpoint: config.autocompleteAdvancedServerEndpoint,
                    accessToken: config.autocompleteAdvancedAccessToken,
                })
            }

            debug(
                'createProviderConfig',
                'Provider `unstable-huggingface` can not be used without configuring `cody.autocomplete.advanced.serverEndpoint`.'
            )
            return null
        }
        case 'unstable-azure-openai': {
            if (config.autocompleteAdvancedServerEndpoint === null) {
                debug(
                    'createProviderConfig',
                    'Provider `unstable-azure-openai` can not be used without configuring `cody.autocomplete.advanced.serverEndpoint`.'
                )
                return null
            }

            if (config.autocompleteAdvancedAccessToken === null) {
                debug(
                    'createProviderConfig',
                    'Provider `unstable-azure-openai` can not be used without configuring `cody.autocomplete.advanced.accessToken`.'
                )
                return null
            }

            return createUnstableAzureOpenAiProviderConfig({
                serverEndpoint: config.autocompleteAdvancedServerEndpoint,
                accessToken: config.autocompleteAdvancedAccessToken,
            })
        }
        case 'unstable-fireworks': {
            if (config.autocompleteAdvancedServerEndpoint !== null) {
                return createUnstableFireworksProviderConfig({
                    serverEndpoint: config.autocompleteAdvancedServerEndpoint,
                    accessToken: config.autocompleteAdvancedAccessToken,
                    model: config.autocompleteAdvancedModel,
                })
            }

            debug(
                'createProviderConfig',
                'Provider `unstable-fireworks` can not be used without configuring `cody.autocomplete.advanced.serverEndpoint`.'
            )
            return null
        }
        case 'anthropic': {
            return createAnthropicProviderConfig({
                completionsClient,
                contextWindowTokens: 2048,
            })
        }
        default:
            debug('createProviderConfig', `Unrecognized provider '${config.autocompleteAdvancedProvider}' configured.`)
            return null
    }
}

async function resolveDefaultProvider(
    configuredProvider: string | null,
    featureFlagProvider?: FeatureFlagProvider
): Promise<string> {
    if (configuredProvider) {
        return configuredProvider
    }

    if (await featureFlagProvider?.evaluateFeatureFlag(FeatureFlag.CodyAutocompleteDefaultProviderFireworks)) {
        return 'unstable-fireworks'
    }

    return 'anthropic'
}
