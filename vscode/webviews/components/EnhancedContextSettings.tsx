import * as React from 'react'

import { VSCodeButton, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react'
import { clsx } from 'clsx'

import {
    type ContextGroup,
    type ContextProvider,
    type EnhancedContextContextT,
    type LocalEmbeddingsProvider,
    type LocalSearchProvider,
    type RemoteSearchProvider,
    isMacOS,
} from '@sourcegraph/cody-shared'
import { useEnhancedContextEnabled } from '../chat/EnhancedContext'

import { PopupFrame } from '../Popups/Popup'
import { getVSCodeAPI } from '../utils/VSCodeApi'

import popupStyles from '../Popups/Popup.module.css'
import { SparkleSlash } from '../icons/SparkleSlash'
import styles from './EnhancedContextSettings.module.css'

export enum EnhancedContextPresentationMode {
    // An expansive display with heterogenous providers grouped by source.
    Consumer = 'consumer',
    // A compact display with remote search providers over a list of sources.
    Enterprise = 'enterprise',
}

interface EnhancedContextSettingsProps {
    presentationMode: 'consumer' | 'enterprise'
    isOpen: boolean
    setOpen: (open: boolean) => void
}

function defaultEnhancedContextContext(): EnhancedContextContextT {
    return {
        groups: [],
    }
}

export const EnhancedContextContext: React.Context<EnhancedContextContextT> = React.createContext(
    defaultEnhancedContextContext()
)

export const EnhancedContextEventHandlers: React.Context<EnhancedContextEventHandlersT> =
    React.createContext({
        onChooseRemoteSearchRepo: (): void => {},
        onConsentToEmbeddings: (_): void => {},
        onEnabledChange: (_): void => {},
        onRemoveRemoteSearchRepo: (_): void => {},
        onShouldBuildSymfIndex: (_): void => {},
    })

export interface EnhancedContextEventHandlersT {
    onChooseRemoteSearchRepo: () => void
    onConsentToEmbeddings: (provider: LocalEmbeddingsProvider) => void
    onEnabledChange: (enabled: boolean) => void
    onRemoveRemoteSearchRepo: (id: string) => void
    onShouldBuildSymfIndex: (provider: LocalSearchProvider) => void
}

function useEnhancedContextContext(): EnhancedContextContextT {
    return React.useContext(EnhancedContextContext)
}

function useEnhancedContextEventHandlers(): EnhancedContextEventHandlersT {
    return React.useContext(EnhancedContextEventHandlers)
}

// Shortens a repository name into a more succinct--but ambiguous--display name.
function briefName(name: string): string {
    return name.slice(name.lastIndexOf('/') + 1)
}

const CompactGroupsComponent: React.FunctionComponent<{
    groups: readonly ContextGroup[]
    handleChoose: () => void
    handleRemove: (id: string) => void
}> = ({ groups, handleChoose, handleRemove }): React.ReactNode => {
    // The compact groups component is only used for enterprise context, which
    // uses homogeneous remote search providers. Lift the providers out of the
    // groups.
    const liftedProviders: [string, RemoteSearchProvider][] = []
    for (const group of groups) {
        const providers = group.providers.filter(
            (provider: ContextProvider): provider is RemoteSearchProvider =>
                provider.kind === 'search' && provider.type === 'remote'
        )
        console.assert(
            providers.length === group.providers.length,
            'enterprise context should only use remote search providers',
            JSON.stringify(group.providers)
        )
        if (providers.length) {
            liftedProviders.push([group.displayName, providers[0]])
        }
    }

    // Sort the providers so automatically included ones appear first, then sort
    // by name.
    liftedProviders.sort((a, b) => {
        if (a[1].inclusion === 'auto' && b[1].inclusion !== 'auto') {
            return -1
        }
        if (b[1].inclusion === 'auto') {
            return 1
        }
        return briefName(a[0]).localeCompare(briefName(b[0]))
    })

    return (
        <div className={styles.enterpriseRepoList}>
            <h1>Repositories</h1>
            {liftedProviders.length === 0 ? (
                <p className={styles.noReposMessage}>No repositories selected</p>
            ) : (
                liftedProviders.map(([group, provider]) => (
                    <CompactProviderComponent
                        key={provider.id}
                        id={provider.id}
                        name={group}
                        inclusion={provider.inclusion}
                        handleRemove={handleRemove}
                        isIgnored={provider.isIgnored}
                    />
                ))
            )}
            <VSCodeButton onClick={() => handleChoose()} className={styles.chooseRepositoriesButton}>
                Choose Repositories&hellip;
            </VSCodeButton>
        </div>
    )
}

const CompactProviderComponent: React.FunctionComponent<{
    id: string
    name: string
    inclusion: 'auto' | 'manual'
    handleRemove: (id: string) => void
    isIgnored: boolean
}> = ({ id, name, inclusion, handleRemove, isIgnored }) => {
    return (
        <div className={styles.enterpriseRepoListItem}>
            <i
                className={clsx('codicon', isIgnored ? 'codicon-circle-slash' : 'codicon-repo-forked')}
                title={name}
            />
            <span className={clsx(styles.repoName, { [styles.repoNameMuted]: isIgnored })} title={name}>
                {briefName(name)}
            </span>
            {isIgnored ? (
                <span className={styles.infoClose}>
                    <i className="codicon codicon-info" title="Repo ignored by an admin setting." />
                </span>
            ) : inclusion === 'auto' ? (
                <span className={styles.infoClose}>
                    <i
                        className="codicon codicon-info"
                        title="Included automatically based on your workspace"
                    />
                </span>
            ) : (
                <button
                    className={styles.infoClose}
                    onClick={() => handleRemove(id)}
                    type="button"
                    title={`Remove ${briefName(name)}`}
                >
                    <i className="codicon codicon-close" />
                </button>
            )}
        </div>
    )
}

const ContextGroupComponent: React.FunctionComponent<{
    group: ContextGroup
    allGroups: ContextGroup[]
}> = ({ group, allGroups }): React.ReactNode => {
    // if there's a single group, we want the group name's basename
    let groupName: string
    if (allGroups.length === 1) {
        const matches = group.displayName.match(/.+[/\\](.+?)$/)
        groupName = matches ? matches[1] : group.displayName
    } else {
        groupName = group.displayName
    }

    return (
        <>
            <dt title={group.displayName} className={styles.lineBreakAll}>
                <i className="codicon codicon-folder" /> {groupName}
            </dt>
            <dd>
                <ol className={styles.providersList}>
                    {group.providers.map(provider => (
                        <li key={provider.kind} className={styles.providerItem}>
                            <ContextProviderComponent provider={provider} />
                        </li>
                    ))}
                </ol>
            </dd>
        </>
    )
}

function labelFor(kind: string): string {
    // All our context providers are single words; just convert them to title
    // case
    return kind[0].toUpperCase() + kind.slice(1)
}

const SearchIndexComponent: React.FunctionComponent<{
    provider: LocalSearchProvider
    indexStatus: 'failed' | 'unindexed'
}> = ({ provider, indexStatus }): React.ReactNode => {
    const events = useEnhancedContextEventHandlers()
    const onClick = (): void => {
        events.onShouldBuildSymfIndex(provider)
    }
    return (
        <div>
            {indexStatus === 'failed' ? (
                <>
                    <p className={styles.providerExplanatoryText}>
                        The previous indexing attempt failed or was cancelled.
                    </p>
                </>
            ) : (
                <p className={styles.providerExplanatoryText}>
                    The repository&apos;s contents will be indexed locally.
                </p>
            )}
            <p>
                <VSCodeButton onClick={onClick}>
                    {indexStatus === 'failed' ? 'Retry local index' : 'Build local index'}
                </VSCodeButton>
            </p>
        </div>
    )
}

const EmbeddingsConsentComponent: React.FunctionComponent<{ provider: LocalEmbeddingsProvider }> = ({
    provider,
}): React.ReactNode => {
    const events = useEnhancedContextEventHandlers()
    const onClick = (): void => {
        events.onConsentToEmbeddings(provider)
    }
    return (
        <div>
            <p className={styles.providerExplanatoryText}>
                The repository&apos;s contents will be uploaded to{' '}
                {provider.embeddingsAPIProvider === 'sourcegraph' ? 'Sourcegraph' : 'OpenAI'}
                &apos;s Embeddings API and then stored locally.
                {/* To exclude files, set up a <a href="about:blank#TODO">Cody ignore file.</a> */}
            </p>
            <p>
                <VSCodeButton onClick={onClick}>Enable Embeddings</VSCodeButton>
            </p>
        </div>
    )
}

function contextProviderState(provider: ContextProvider): React.ReactNode {
    switch (provider.state) {
        case 'indeterminate':
            return <></>
        case 'ready':
            return <span className={styles.providerInlineState}>&mdash; Indexed</span>
        case 'indexing':
            return <span className={styles.providerInlineState}>&mdash; Indexing&hellip;</span>
        case 'unconsented':
            return <EmbeddingsConsentComponent provider={provider} />
        case 'no-match':
            if (provider.kind === 'embeddings') {
                // Error messages for local embeddings missing.
                switch (provider.errorReason) {
                    case 'not-a-git-repo':
                        return (
                            <p className={styles.providerExplanatoryText}>
                                Folder is not a Git repository root.
                            </p>
                        )
                    case 'git-repo-has-no-remote':
                        return (
                            <p className={styles.providerExplanatoryText}>
                                Git repository is missing a remote origin.
                            </p>
                        )
                    default:
                        return <></>
                }
            }
            return <></>
        case 'unindexed':
            if (provider.kind === 'search') {
                return <SearchIndexComponent indexStatus="unindexed" provider={provider} />
            }
            return ''
        case 'failed':
            if (provider.kind === 'search') {
                return <SearchIndexComponent indexStatus="failed" provider={provider} />
            }
            return ''
        default:
            return ''
    }
}

const ContextProviderComponent: React.FunctionComponent<{
    provider: ContextProvider
}> = ({ provider }) => {
    let stateIcon: string | React.ReactElement
    switch (provider.state) {
        case 'indeterminate':
        case 'indexing':
            stateIcon = <i className="codicon codicon-loading codicon-modifier-spin" />
            break
        case 'unindexed':
        case 'unconsented':
            stateIcon = <i className="codicon codicon-circle-outline" />
            break
        case 'ready':
            stateIcon = <i className="codicon codicon-database" />
            break
        case 'no-match':
            stateIcon = <i className="codicon codicon-circle-slash" />
            break
        case 'failed':
            stateIcon = <i className="codicon codicon-error" />
            break
        default:
            stateIcon = '?'
            break
    }
    return (
        <>
            <span className={styles.providerIconAndName}>
                {stateIcon} <span className={styles.providerLabel}>{labelFor(provider.kind)}</span>
            </span>{' '}
            {contextProviderState(provider)}
        </>
    )
}

export const EnhancedContextSettings: React.FunctionComponent<EnhancedContextSettingsProps> = ({
    presentationMode,
    isOpen,
    setOpen,
}): React.ReactNode => {
    const events = useEnhancedContextEventHandlers()
    const context = useEnhancedContextContext()
    const [enabled, setEnabled] = React.useState<boolean>(useEnhancedContextEnabled())
    const enabledChanged = React.useCallback(
        (shouldEnable: boolean, source: 'btn' | 'checkbox' | 'altKey'): void => {
            if (enabled !== shouldEnable) {
                events.onEnabledChange(shouldEnable)
                setEnabled(shouldEnable)
                // Log when a user clicks on the Enhanced Context toggle. Event names:
                // Checkbox click: `CodyVSCodeExtension:useEnhancedContextToggler:clicked`
                // Button click: `CodyVSCodeExtension:useEnhancedContextTogglerBtn:clicked`
                const eventName = source === 'btn' ? 'Btn' : source === 'altKey' ? 'AltKey' : ''
                getVSCodeAPI().postMessage({
                    command: 'event',
                    eventName: `CodyVSCodeExtension:useEnhancedContextToggler${eventName}:clicked`,
                    properties: { useEnhancedContext: shouldEnable },
                })
            }
        },
        [events, enabled]
    )

    // Holding down the Alt/Opt key unchecks the box if it is checked.
    const [disabledByAltKeyDown, setDisabledByAltKeyDown] = React.useState(false)
    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.altKey && enabled) {
                setDisabledByAltKeyDown(true)
                enabledChanged(false, 'altKey')
            }
        }
        const onKeyUp = (event: KeyboardEvent) => {
            if (!event.altKey && disabledByAltKeyDown) {
                setDisabledByAltKeyDown(false)
                enabledChanged(true, 'altKey')
            }
        }
        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('keyup', onKeyUp)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('keyup', onKeyUp)
        }
    }, [enabled, disabledByAltKeyDown, enabledChanged])

    // Handles removing a manually added remote search provider.
    const handleRemoveRemoteSearchRepo = React.useCallback(
        (id: string) => {
            events.onRemoveRemoteSearchRepo(id)
        },
        [events]
    )
    const handleChooseRemoteSearchRepo = React.useCallback(
        () => events.onChooseRemoteSearchRepo(),
        [events]
    )

    const hasOpenedBeforeKey = 'enhanced-context-settings.has-opened-before'
    const hasOpenedBefore = localStorage.getItem(hasOpenedBeforeKey) === 'true'
    if (isOpen && !hasOpenedBefore) {
        localStorage.setItem(hasOpenedBeforeKey, 'true')
    }

    // Can't point at and use VSCodeCheckBox type with 'ref'

    const autofocusTarget = React.useRef<any>(null)
    React.useEffect(() => {
        if (isOpen) {
            // Set focus to the checkbox when the popup is opened
            // after a 100ms delay to ensure the popup is fully rendered
            setTimeout(() => {
                autofocusTarget.current?.focus()
            }, 100)
        }
    }, [isOpen])

    // Can't point at and use VSCodeButton type with 'ref'
    const restoreFocusTarget = React.useRef<any>(null)
    const handleDismiss = React.useCallback(() => {
        setOpen(false)
    }, [setOpen])

    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLElement>): void => {
            // Close the popup on escape
            if (event.key === 'Escape') {
                handleDismiss()
            }
        },
        [handleDismiss]
    )

    return (
        <div className={clsx(popupStyles.popupHost)} onKeyDown={onKeyDown}>
            <PopupFrame
                isOpen={isOpen}
                onDismiss={handleDismiss}
                classNames={[popupStyles.popupTrail, styles.popup]}
            >
                <div className={styles.container}>
                    <div>
                        <VSCodeCheckbox
                            onChange={e =>
                                enabledChanged((e.target as HTMLInputElement)?.checked, 'checkbox')
                            }
                            checked={enabled}
                            id="enhanced-context-checkbox"
                            ref={autofocusTarget}
                        />
                    </div>
                    <div>
                        <label htmlFor="enhanced-context-checkbox">
                            <h1>Enhanced Context ✨</h1>
                        </label>
                        <p>
                            Automatically include additional context from your codebase.{' '}
                            <a href="https://sourcegraph.com/docs/cody/clients/install-vscode#enhanced-context-selector">
                                Learn more
                            </a>
                        </p>
                        {presentationMode === EnhancedContextPresentationMode.Consumer ? (
                            <dl className={styles.foldersList}>
                                {context.groups.map(group => (
                                    <ContextGroupComponent
                                        key={group.displayName}
                                        group={group}
                                        allGroups={context.groups}
                                    />
                                ))}
                            </dl>
                        ) : (
                            <CompactGroupsComponent
                                groups={context.groups}
                                handleChoose={handleChooseRemoteSearchRepo}
                                handleRemove={handleRemoveRemoteSearchRepo}
                            />
                        )}
                        <p className={styles.hint}>
                            Tip: To include a specific file or symbol as context, type @ in the message
                            input.
                        </p>
                    </div>
                </div>
            </PopupFrame>
            <VSCodeButton
                className={clsx(
                    styles.settingsBtns,
                    styles.settingsIndicator,
                    enabled && styles.settingsIndicatorActive
                )}
                onClick={() => enabledChanged(!enabled, 'btn')}
                appearance="icon"
                type="button"
                title={`${enabled ? 'Disable' : 'Enable'} Enhanced Context (hold ${
                    isMacOS() ? 'Opt' : 'Alt'
                } to disable)`}
            >
                {enabled ? <i className="codicon codicon-sparkle" /> : <SparkleSlash />}
            </VSCodeButton>
            <VSCodeButton
                className={clsx(
                    styles.settingsBtns,
                    styles.settingsBtn,
                    isOpen && styles.settingsBtnActive
                )}
                appearance="icon"
                type="button"
                onClick={() => setOpen(!isOpen)}
                title="Configure Enhanced Context"
                ref={restoreFocusTarget}
            >
                <i className="codicon codicon-chevron-down" />
            </VSCodeButton>
        </div>
    )
}
