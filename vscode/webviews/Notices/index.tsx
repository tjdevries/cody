import type { VSCodeWrapper } from '../utils/VSCodeApi'
import { OnboardingAutocompleteNotice } from './OnboardingAutocompleteNotice'
import { VersionUpdatedNotice } from './VersionUpdatedNotice'

import styles from './index.module.css'

interface NoticesProps {
    probablyNewInstall: boolean | undefined
    vscodeAPI: VSCodeWrapper
}

export const Notices: React.FunctionComponent<NoticesProps> = ({ probablyNewInstall, vscodeAPI }) => (
    <div className={styles.notices}>
        {probablyNewInstall !== undefined && (
            <VersionUpdatedNotice probablyNewInstall={probablyNewInstall} />
        )}
        <OnboardingAutocompleteNotice vscodeAPI={vscodeAPI} />
    </div>
)
