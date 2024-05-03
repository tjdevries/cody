import * as rpc from "vscode-jsonrpc/node";
// ==============
// Client->Server
// ==============
export const initialize = new rpc.RequestType<
   ClientInfo,
   ServerInfo,
   void
>("initialize")
export const shutdown = new rpc.RequestType<
   null,
   null,
   void
>("shutdown")
export const chat_new = new rpc.RequestType<
   null,
   string,
   void
>("chat/new")
export const chat_restore = new rpc.RequestType<
   Chat_RestoreParams,
   string,
   void
>("chat/restore")
export const chat_models = new rpc.RequestType<
   Chat_ModelsParams,
   Chat_ModelsResult,
   void
>("chat/models")
export const chat_export = new rpc.RequestType<
   null,
   ChatExportResult[],
   void
>("chat/export")
export const chat_remoteRepos = new rpc.RequestType<
   Chat_RemoteReposParams,
   Chat_RemoteReposResult,
   void
>("chat/remoteRepos")
export const chat_submitMessage = new rpc.RequestType<
   Chat_SubmitMessageParams,
   ExtensionMessage,
   void
>("chat/submitMessage")
export const chat_editMessage = new rpc.RequestType<
   Chat_EditMessageParams,
   ExtensionMessage,
   void
>("chat/editMessage")
export const commands_explain = new rpc.RequestType<
   null,
   string,
   void
>("commands/explain")
export const commands_test = new rpc.RequestType<
   null,
   string,
   void
>("commands/test")
export const commands_smell = new rpc.RequestType<
   null,
   string,
   void
>("commands/smell")
export const commands_custom = new rpc.RequestType<
   Commands_CustomParams,
   CustomCommandResult,
   void
>("commands/custom")
export const editCommands_code = new rpc.RequestType<
   EditCommands_CodeParams,
   EditTask,
   void
>("editCommands/code")
export const editCommands_test = new rpc.RequestType<
   null,
   EditTask,
   void
>("editCommands/test")
export const editCommands_document = new rpc.RequestType<
   null,
   EditTask,
   void
>("editCommands/document")
export const editTask_accept = new rpc.RequestType<
   EditTask_AcceptParams,
   null,
   void
>("editTask/accept")
export const editTask_undo = new rpc.RequestType<
   EditTask_UndoParams,
   null,
   void
>("editTask/undo")
export const editTask_cancel = new rpc.RequestType<
   EditTask_CancelParams,
   null,
   void
>("editTask/cancel")
export const editTask_getFoldingRanges = new rpc.RequestType<
   GetFoldingRangeParams,
   GetFoldingRangeResult,
   void
>("editTask/getFoldingRanges")
export const command_execute = new rpc.RequestType<
   ExecuteCommandParams,
   any,
   void
>("command/execute")
export const autocomplete_execute = new rpc.RequestType<
   AutocompleteParams,
   AutocompleteResult,
   void
>("autocomplete/execute")
export const graphql_getRepoIds = new rpc.RequestType<
   Graphql_GetRepoIdsParams,
   Graphql_GetRepoIdsResult,
   void
>("graphql/getRepoIds")
export const graphql_currentUserId = new rpc.RequestType<
   null,
   string,
   void
>("graphql/currentUserId")
export const graphql_currentUserIsPro = new rpc.RequestType<
   null,
   boolean,
   void
>("graphql/currentUserIsPro")
export const featureFlags_getFeatureFlag = new rpc.RequestType<
   FeatureFlags_GetFeatureFlagParams,
   boolean,
   void
>("featureFlags/getFeatureFlag")
export const graphql_getCurrentUserCodySubscription = new rpc.RequestType<
   null,
   CurrentUserCodySubscription,
   void
>("graphql/getCurrentUserCodySubscription")
export const graphql_logEvent = new rpc.RequestType<
   Event,
   null,
   void
>("graphql/logEvent")
export const telemetry_recordEvent = new rpc.RequestType<
   TelemetryEvent,
   null,
   void
>("telemetry/recordEvent")
export const graphql_getRepoIdIfEmbeddingExists = new rpc.RequestType<
   Graphql_GetRepoIdIfEmbeddingExistsParams,
   string,
   void
>("graphql/getRepoIdIfEmbeddingExists")
export const graphql_getRepoId = new rpc.RequestType<
   Graphql_GetRepoIdParams,
   string,
   void
>("graphql/getRepoId")
export const git_codebaseName = new rpc.RequestType<
   Git_CodebaseNameParams,
   string,
   void
>("git/codebaseName")
export const webview_didDispose = new rpc.RequestType<
   Webview_DidDisposeParams,
   null,
   void
>("webview/didDispose")
export const webview_receiveMessage = new rpc.RequestType<
   Webview_ReceiveMessageParams,
   null,
   void
>("webview/receiveMessage")
export const testing_progress = new rpc.RequestType<
   Testing_ProgressParams,
   Testing_ProgressResult,
   void
>("testing/progress")
export const testing_networkRequests = new rpc.RequestType<
   null,
   Testing_NetworkRequestsResult,
   void
>("testing/networkRequests")
export const testing_requestErrors = new rpc.RequestType<
   null,
   Testing_RequestErrorsResult,
   void
>("testing/requestErrors")
export const testing_closestPostData = new rpc.RequestType<
   Testing_ClosestPostDataParams,
   Testing_ClosestPostDataResult,
   void
>("testing/closestPostData")
export const testing_progressCancelation = new rpc.RequestType<
   Testing_ProgressCancelationParams,
   Testing_ProgressCancelationResult,
   void
>("testing/progressCancelation")
export const testing_reset = new rpc.RequestType<
   null,
   null,
   void
>("testing/reset")
export const extensionConfiguration_change = new rpc.RequestType<
   ExtensionConfiguration,
   AuthStatus,
   void
>("extensionConfiguration/change")
export const extensionConfiguration_status = new rpc.RequestType<
   null,
   AuthStatus,
   void
>("extensionConfiguration/status")
export const attribution_search = new rpc.RequestType<
   Attribution_SearchParams,
   Attribution_SearchResult,
   void
>("attribution/search")
export const ignore_test = new rpc.RequestType<
   Ignore_TestParams,
   Ignore_TestResult,
   void
>("ignore/test")
export const testing_ignore_overridePolicy = new rpc.RequestType<
   ContextFilters,
   null,
   void
>("testing/ignore/overridePolicy")
export const remoteRepo_has = new rpc.RequestType<
   RemoteRepo_HasParams,
   RemoteRepo_HasResult,
   void
>("remoteRepo/has")
export const remoteRepo_list = new rpc.RequestType<
   RemoteRepo_ListParams,
   RemoteRepo_ListResult,
   void
>("remoteRepo/list")
const initialized = new rpc.NotificationType<,,scip-typescript npm typescript . null#,, void>("initialized")
const exit = new rpc.NotificationType<,,scip-typescript npm typescript . null#,, void>("exit")
const extensionConfiguration_didChange = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/ExtensionConfiguration#,, void>("extensionConfiguration/didChange")
const textDocument_didOpen = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/ProtocolTextDocument#,, void>("textDocument/didOpen")
const textDocument_didChange = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/ProtocolTextDocument#,, void>("textDocument/didChange")
const textDocument_didFocus = new rpc.NotificationType<,,,,,,,,,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/uri2:,, void>("textDocument/didFocus")
const textDocument_didSave = new rpc.NotificationType<,,,,,,,,,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/uri3:,, void>("textDocument/didSave")
const textDocument_didClose = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/ProtocolTextDocument#,, void>("textDocument/didClose")
const workspace_didDeleteFiles = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/DeleteFilesParams#,, void>("workspace/didDeleteFiles")
const workspace_didCreateFiles = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/CreateFilesParams#,, void>("workspace/didCreateFiles")
const workspace_didRenameFiles = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/RenameFilesParams#,, void>("workspace/didRenameFiles")
const $_cancelRequest = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/CancelParams#,, void>("$/cancelRequest")
const autocomplete_clearLastCandidate = new rpc.NotificationType<,,scip-typescript npm typescript . null#,, void>("autocomplete/clearLastCandidate")
const autocomplete_completionSuggested = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/CompletionItemParams#,, void>("autocomplete/completionSuggested")
const autocomplete_completionAccepted = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/CompletionItemParams#,, void>("autocomplete/completionAccepted")
const progress_cancel = new rpc.NotificationType<,,,,,,,,,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/id12:,, void>("progress/cancel")
// ==============
// Server->Client
// ==============
export const window_showMessage = new rpc.RequestType<
   ShowWindowMessageParams,
   string,
   void
>("window/showMessage")
export const textDocument_edit = new rpc.RequestType<
   TextDocumentEditParams,
   boolean,
   void
>("textDocument/edit")
export const textDocument_openUntitledDocument = new rpc.RequestType<
   UntitledTextDocument,
   boolean,
   void
>("textDocument/openUntitledDocument")
export const textDocument_show = new rpc.RequestType<
   TextDocument_ShowParams,
   boolean,
   void
>("textDocument/show")
export const workspace_edit = new rpc.RequestType<
   WorkspaceEditParams,
   boolean,
   void
>("workspace/edit")
export const webview_create = new rpc.RequestType<
   Webview_CreateParams,
   null,
   void
>("webview/create")
const debug_message = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/DebugMessage#,, void>("debug/message")
const editTask_didUpdate = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/EditTask#,, void>("editTask/didUpdate")
const editTask_didDelete = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/EditTask#,, void>("editTask/didDelete")
const codeLenses_display = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/DisplayCodeLensParams#,, void>("codeLenses/display")
const ignore_didChange = new rpc.NotificationType<,,scip-typescript npm typescript . null#,, void>("ignore/didChange")
const webview_postMessage = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/WebviewPostMessageParams#,, void>("webview/postMessage")
const progress_start = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/ProgressStartParams#,, void>("progress/start")
const progress_report = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/ProgressReportParams#,, void>("progress/report")
const progress_end = new rpc.NotificationType<,,,,,,,,,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/id13:,, void>("progress/end")
const remoteRepo_didChange = new rpc.NotificationType<,,scip-typescript npm typescript . null#,, void>("remoteRepo/didChange")
const remoteRepo_didChangeState = new rpc.NotificationType<,,scip-typescript npm cody-ai 1.14.0 src/jsonrpc/`agent-protocol.ts`/RemoteRepoFetchState#,, void>("remoteRepo/didChangeState")
// ==============
// Relevant Types
// ==============

// RemoteRepoFetchState
// undefined
export interface RemoteRepoFetchState {
  state: String
  error?: CodyError
}

// CodyError
// undefined
export interface CodyError {
  message: string
  cause?: CodyError
  stack?: string
}

// Progress_EndParams
// undefined
export interface Progress_EndParams {
  id: string
}

// ProgressReportParams
// undefined
export interface ProgressReportParams {
  id: string
  message?: string
  increment?: int
}

// ProgressStartParams
// undefined
export interface ProgressStartParams {
  id: string
  options: ProgressOptions
}

// ProgressOptions
// undefined
export interface ProgressOptions {
  title?: string
  location?: string
  locationViewId?: string
  cancellable?: boolean
}

// WebviewPostMessageParams
// undefined
export interface WebviewPostMessageParams {
  id: string
  message: ExtensionMessage
}

// ExtensionMessage

export interface ExtensionMessage {
}

//  : ExtensionMessage()
export interface ConfigExtensionMessage {
  type: type
  config: ConfigParams
  authStatus: AuthStatus
  workspaceFolderUris: string[]
}

//  : ExtensionMessage()
export interface Search_configExtensionMessage {
  type: type
  workspaceFolderUris: string[]
}

//  : ExtensionMessage()
export interface HistoryExtensionMessage {
  type: type
  localHistory?: UserLocalHistory
}

//  : ExtensionMessage()
export interface TranscriptExtensionMessage {
  type: type
  messages: SerializedChatMessage[]
  isMessageInProgress: boolean
  chatID: string
}

//  : ExtensionMessage()
export interface ViewExtensionMessage {
  type: type
  view: View
}

//  : ExtensionMessage()
export interface ErrorsExtensionMessage {
  type: type
  errors: string
}

//  : ExtensionMessage()
export interface NoticeExtensionMessage {
  type: type
  notice: NoticeParams
}

//  : ExtensionMessage()
export interface Transcript-errorsExtensionMessage {
  type: type
  isTranscriptError: boolean
}

//  : ExtensionMessage()
export interface UserContextFilesExtensionMessage {
  type: type
  userContextFiles?: ContextItem[]
}

//  : ExtensionMessage()
export interface Chat-input-contextExtensionMessage {
  type: type
  items: ContextItem[]
}

//  : ExtensionMessage()
export interface ChatModelsExtensionMessage {
  type: type
  models: ModelProvider[]
}

//  : ExtensionMessage()
export interface Update-search-resultsExtensionMessage {
  type: type
  results: SearchPanelFile[]
  query: string
}

//  : ExtensionMessage()
export interface Index-updatedExtensionMessage {
  type: type
  scopeDir: string
}

//  : ExtensionMessage()
export interface Enhanced-contextExtensionMessage {
  type: type
  enhancedContextStatus: EnhancedContextContextT
}

//  : ExtensionMessage()
export interface AttributionExtensionMessage {
  type: type
  snippet: string
  attribution?: AttributionParams
  error?: string
}

//  : ExtensionMessage()
export interface SetChatEnabledConfigFeatureExtensionMessage {
  type: type
  data: boolean
}

//  : ExtensionMessage()
export interface Webview-stateExtensionMessage {
  type: type
  isActive: boolean
}

//  : ExtensionMessage()
export interface Context_remote-reposExtensionMessage {
  type: type
  repos: Repo[]
}

//  : ExtensionMessage()
export interface SetConfigFeaturesExtensionMessage {
  type: type
  configFeatures: ConfigFeaturesParams
}

// ConfigFeaturesParams
// undefined
export interface ConfigFeaturesParams {
  chat: boolean
  attribution: boolean
}

// Repo
// undefined
export interface Repo {
  name: string
  id: string
}

// AttributionParams
// undefined
export interface AttributionParams {
  repositoryNames: string[]
  limitHit: boolean
}

// EnhancedContextContextT
// undefined
export interface EnhancedContextContextT {
  groups: ContextGroup[]
}

// ContextGroup
// undefined
export interface ContextGroup {
  dir?: Uri
  displayName: string
  providers: ContextProvider[]
}

// ContextProvider

export interface ContextProvider {
}

//  : ContextProvider()
export interface LocalEmbeddingsProvider {
  kind: kind
  state: String
  errorReason?: String
  embeddingsAPIProvider: EmbeddingsProvider
}

//  : ContextProvider()
export interface LocalSearchProvider {
  kind: kind
  type: type
  state: String
}

//  : ContextProvider()
export interface RemoteSearchProvider {
  kind: kind
  type: type
  state: String
  id: string
  inclusion: String
}

// EmbeddingsProvider
typealias EmbeddingsProvider = sourcegraph | openai

// Uri
// undefined
export interface Uri {
  scheme: string
  authority: string
  path: string
  query: string
  fragment: string
}

// SearchPanelFile
// undefined
export interface SearchPanelFile {
  uri: Uri
  snippets: SearchPanelSnippet[]
}

// SearchPanelSnippet
// undefined
export interface SearchPanelSnippet {
  contents: string
  range: RangeParams
}

// RangeParams
// undefined
export interface RangeParams {
  start: StartParams
  end: EndParams
}

// EndParams
// undefined
export interface EndParams {
  line: int
  character: int
}

// StartParams
// undefined
export interface StartParams {
  line: int
  character: int
}

// ModelProvider
// undefined
export interface ModelProvider {
  default: boolean
  codyProOnly: boolean
  provider: string
  title: string
  primaryProviders: ModelProvider[]
  localProviders: ModelProvider[]
}

// ContextItem

export interface ContextItem {
}

//  : ContextItem()
export interface ContextItemFile {
  uri: Uri
  range?: RangeData
  content?: string
  repoName?: string
  revision?: string
  title?: string
  source?: ContextItemSource
  size?: int
  isTooLarge?: boolean
  provider?: string
  type: type
}

//  : ContextItem()
export interface ContextItemSymbol {
  uri: Uri
  range?: RangeData
  content?: string
  repoName?: string
  revision?: string
  title?: string
  source?: ContextItemSource
  size?: int
  isTooLarge?: boolean
  provider?: string
  type: type
  symbolName: string
  kind: SymbolKind
}

//  : ContextItem()
export interface ContextItemPackage {
  uri: Uri
  range?: RangeData
  content?: string
  repoName?: string
  revision?: string
  title?: string
  source?: ContextItemSource
  size?: int
  isTooLarge?: boolean
  provider?: string
  type: type
  repoID: string
  ecosystem: string
  name: string
}

// ContextItemSource
typealias ContextItemSource = embeddings | user | keyword | editor | filename | search | unified | selection | terminal | uri | package

// RangeData
// undefined
export interface RangeData {
  start: StartParams
  end: EndParams
}

// EndParams
// undefined
export interface EndParams {
  line: int
  character: int
}

// StartParams
// undefined
export interface StartParams {
  line: int
  character: int
}

// SymbolKind
typealias SymbolKind = class | function | method

// NoticeParams
// undefined
export interface NoticeParams {
  key: string
}

// View
typealias View = chat | login

// SerializedChatMessage
// undefined
export interface SerializedChatMessage {
  contextFiles?: ContextItem[]
  error?: ChatError
  editorState?: any
  speaker: String
  text?: string
}

// ChatError
// undefined
export interface ChatError {
  kind?: string
  name: string
  message: string
  retryAfter?: string
  limit?: int
  userMessage?: string
  retryAfterDate?: Date
  retryAfterDateString?: string
  retryMessage?: string
  feature?: string
  upgradeIsAvailable?: boolean
  isChatErrorGuard: isChatErrorGuard
}

// Date
typealias Date = String

// UserLocalHistory
// undefined
export interface UserLocalHistory {
  chat: ChatHistory
}

// ChatHistory
// undefined
export interface ChatHistory {
  chatID: string
}

// AuthStatus
// undefined
export interface AuthStatus {
  username: string
  endpoint?: string
  isDotCom: boolean
  isLoggedIn: boolean
  showInvalidAccessTokenError: boolean
  authenticated: boolean
  hasVerifiedEmail: boolean
  requiresVerifiedEmail: boolean
  siteHasCodyEnabled: boolean
  siteVersion: string
  codyApiVersion: int
  configOverwrites?: CodyLLMSiteConfiguration
  showNetworkError?: boolean
  primaryEmail: string
  displayName?: string
  avatarURL: string
  userCanUpgrade: boolean
}

// CodyLLMSiteConfiguration
// undefined
export interface CodyLLMSiteConfiguration {
  chatModel?: string
  chatModelMaxTokens?: int
  fastChatModel?: string
  fastChatModelMaxTokens?: int
  completionModel?: string
  completionModelMaxTokens?: int
  provider?: string
}

// ConfigParams
// undefined
export interface ConfigParams {
  experimentalGuardrails: boolean
  serverEndpoint: string
  uiKindIsWeb: boolean
}

// DisplayCodeLensParams
// undefined
export interface DisplayCodeLensParams {
  uri: string
  codeLenses: ProtocolCodeLens[]
}

// ProtocolCodeLens
// undefined
export interface ProtocolCodeLens {
  range: Range
  command?: ProtocolCommand
  isResolved: boolean
}

// ProtocolCommand
// undefined
export interface ProtocolCommand {
  title: TitleParams
  command: string
  tooltip?: string
  arguments?: any[]
}

// TitleParams
// undefined
export interface TitleParams {
  text: string
  icons: IconsParams[]
}

// IconsParams
// undefined
export interface IconsParams {
  value: string
  position: int
}

// Range
// undefined
export interface Range {
  start: Position
  end: Position
}

// Position
// undefined
export interface Position {
  line: int
  character: int
}

// EditTask
// undefined
export interface EditTask {
  id: string
  state: CodyTaskState
  error?: CodyError
  selectionRange: Range
}

// CodyTaskState
// undefined
export interface CodyTaskState {
  idle: int
  working: int
  inserting: int
  applying: int
  formatting: int
  applied: int
  finished: int
  error: int
  pending: int
}

// DebugMessage
// undefined
export interface DebugMessage {
  channel: string
  message: string
}

// Webview_CreateParams
// undefined
export interface Webview_CreateParams {
  id: string
  data: any
}

// WorkspaceEditParams
// undefined
export interface WorkspaceEditParams {
  operations: WorkspaceEditOperation[]
  metadata?: WorkspaceEditMetadata
}

// WorkspaceEditMetadata
// undefined
export interface WorkspaceEditMetadata {
  isRefactoring?: boolean
}

// WorkspaceEditOperation

export interface WorkspaceEditOperation {
}

//  : WorkspaceEditOperation()
export interface CreateFileOperation {
  type: type
  uri: string
  options?: WriteFileOptions
  textContents: string
  metadata?: WorkspaceEditEntryMetadata
}

//  : WorkspaceEditOperation()
export interface RenameFileOperation {
  type: type
  oldUri: string
  newUri: string
  options?: WriteFileOptions
  metadata?: WorkspaceEditEntryMetadata
}

//  : WorkspaceEditOperation()
export interface DeleteFileOperation {
  type: type
  uri: string
  deleteOptions?: DeleteOptionsParams
  metadata?: WorkspaceEditEntryMetadata
}

//  : WorkspaceEditOperation()
export interface EditFileOperation {
  type: type
  uri: string
  edits: TextEdit[]
}

// TextEdit

export interface TextEdit {
}

//  : TextEdit()
export interface ReplaceTextEdit {
  type: type
  range: Range
  value: string
  metadata?: WorkspaceEditEntryMetadata
}

//  : TextEdit()
export interface InsertTextEdit {
  type: type
  position: Position
  value: string
  metadata?: WorkspaceEditEntryMetadata
}

//  : TextEdit()
export interface DeleteTextEdit {
  type: type
  range: Range
  metadata?: WorkspaceEditEntryMetadata
}

// WorkspaceEditEntryMetadata
// undefined
export interface WorkspaceEditEntryMetadata {
  needsConfirmation: boolean
  label: string
  description?: string
  iconPath?: Uri
}

// Uri
// undefined
export interface Uri {
  scheme: string
  authority: string
  path: string
  query: string
  fragment: string
  fsPath: string
}

// DeleteOptionsParams
// undefined
export interface DeleteOptionsParams {
  recursive?: boolean
  ignoreIfNotExists?: boolean
}

// WriteFileOptions
// undefined
export interface WriteFileOptions {
  overwrite?: boolean
  ignoreIfExists?: boolean
}

// TextDocument_ShowParams
// undefined
export interface TextDocument_ShowParams {
  uri: string
  options?: TextDocumentShowOptions
}

// TextDocumentShowOptions
// undefined
export interface TextDocumentShowOptions {
  viewColumn?: ViewColumn
  preserveFocus?: boolean
  preview?: boolean
  selection: Selection
}

// Selection
// undefined
export interface Selection {
  start: Position
  end: Position
  isEmpty: boolean
  isSingleLine: boolean
  anchor: Position
  active: Position
  isReversed: boolean
}

// Position
// undefined
export interface Position {
  line: int
  character: int
}

// ViewColumn
// undefined
export interface ViewColumn {
  Active: int
  Beside: int
  One: int
  Two: int
  Three: int
  Four: int
  Five: int
  Six: int
  Seven: int
  Eight: int
  Nine: int
}

// UntitledTextDocument
// undefined
export interface UntitledTextDocument {
  uri: string
  content?: string
  language?: string
}

// TextDocumentEditParams
// undefined
export interface TextDocumentEditParams {
  uri: string
  edits: TextEdit[]
  options?: OptionsParams
}

// OptionsParams
// undefined
export interface OptionsParams {
  undoStopBefore: boolean
  undoStopAfter: boolean
}

// ShowWindowMessageParams
// undefined
export interface ShowWindowMessageParams {
  severity: String
  message: string
  options?: MessageOptions
  items?: string[]
}

// MessageOptions
// undefined
export interface MessageOptions {
  modal?: boolean
  detail?: string
}

// Progress_CancelParams
// undefined
export interface Progress_CancelParams {
  id: string
}

// CompletionItemParams
// undefined
export interface CompletionItemParams {
  completionID: string
}

// CancelParams
// undefined
export interface CancelParams {
  id: string
}

// RenameFilesParams
// undefined
export interface RenameFilesParams {
  files: RenameFile[]
}

// RenameFile
// undefined
export interface RenameFile {
  oldUri: string
  newUri: string
}

// CreateFilesParams
// undefined
export interface CreateFilesParams {
  files: FileIdentifier[]
}

// FileIdentifier
// undefined
export interface FileIdentifier {
  uri: string
}

// DeleteFilesParams
// undefined
export interface DeleteFilesParams {
  files: FileIdentifier[]
}

// ProtocolTextDocument
// undefined
export interface ProtocolTextDocument {
  uri: string
  filePath?: string
  content?: string
  selection?: Range
}

// TextDocument_DidSaveParams
// undefined
export interface TextDocument_DidSaveParams {
  uri: string
}

// TextDocument_DidFocusParams
// undefined
export interface TextDocument_DidFocusParams {
  uri: string
}

// ExtensionConfiguration
// undefined
export interface ExtensionConfiguration {
  serverEndpoint: string
  proxy?: string
  accessToken: string
  customHeaders: Map<string, string>
  anonymousUserID?: string
  autocompleteAdvancedProvider?: string
  autocompleteAdvancedModel?: string
  debug?: boolean
  verboseDebug?: boolean
  codebase?: string
  eventProperties?: EventProperties
  customConfiguration?: Map<string, any>
}

// EventProperties
// undefined
export interface EventProperties {
  anonymousUserID: string
  prefix: string
  client: string
  source: source
}

// RemoteRepo_ListResult
// undefined
export interface RemoteRepo_ListResult {
  startIndex: int
  count: int
  repos: ReposParams[]
  state: RemoteRepoFetchState
}

// ReposParams
// undefined
export interface ReposParams {
  name: string
  id: string
}

// RemoteRepo_ListParams
// undefined
export interface RemoteRepo_ListParams {
  query?: string
  first: int
  afterId?: string
}

// RemoteRepo_HasResult
// undefined
export interface RemoteRepo_HasResult {
  result: boolean
}

// RemoteRepo_HasParams
// undefined
export interface RemoteRepo_HasParams {
  repoName: string
}

// ContextFilters
// undefined
export interface ContextFilters {
  include?: CodyContextFilterItem[]
  exclude?: CodyContextFilterItem[]
}

// Ignore_TestResult
// undefined
export interface Ignore_TestResult {
  policy: String
}

// Ignore_TestParams
// undefined
export interface Ignore_TestParams {
  uri: string
}

// Attribution_SearchResult
// undefined
export interface Attribution_SearchResult {
  error?: string
  repoNames: string[]
  limitHit: boolean
}

// Attribution_SearchParams
// undefined
export interface Attribution_SearchParams {
  id: string
  snippet: string
}

// Testing_ProgressCancelationResult
// undefined
export interface Testing_ProgressCancelationResult {
  result: string
}

// Testing_ProgressCancelationParams
// undefined
export interface Testing_ProgressCancelationParams {
  title: string
}

// Testing_ClosestPostDataResult
// undefined
export interface Testing_ClosestPostDataResult {
  closestBody: string
}

// Testing_ClosestPostDataParams
// undefined
export interface Testing_ClosestPostDataParams {
  url: string
  postData: string
}

// Testing_RequestErrorsResult
// undefined
export interface Testing_RequestErrorsResult {
  errors: NetworkRequest[]
}

// NetworkRequest
// undefined
export interface NetworkRequest {
  url: string
  body?: string
  error?: string
}

// Testing_NetworkRequestsResult
// undefined
export interface Testing_NetworkRequestsResult {
  requests: NetworkRequest[]
}

// Testing_ProgressResult
// undefined
export interface Testing_ProgressResult {
  result: string
}

// Testing_ProgressParams
// undefined
export interface Testing_ProgressParams {
  title: string
}

// Webview_ReceiveMessageParams
// undefined
export interface Webview_ReceiveMessageParams {
  id: string
  message: WebviewMessage
}

// WebviewMessage

export interface WebviewMessage {
}

//  : WebviewMessage()
export interface ReadyWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface InitializedWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface EventWebviewMessage {
  command: command
  eventName: string
  properties?: TelemetryEventProperties
}

//  : WebviewMessage()
export interface SubmitWebviewMessage {
  command: command
  addEnhancedContext?: boolean
  contextFiles?: ContextItem[]
  text: string
  submitType: ChatSubmitType
  editorState?: any
}

//  : WebviewMessage()
export interface HistoryWebviewMessage {
  command: command
  action: String
}

//  : WebviewMessage()
export interface RestoreHistoryWebviewMessage {
  command: command
  chatID: string
}

//  : WebviewMessage()
export interface DeleteHistoryWebviewMessage {
  command: command
  chatID: string
}

//  : WebviewMessage()
export interface LinksWebviewMessage {
  command: command
  value: string
}

//  : WebviewMessage()
export interface Show-pageWebviewMessage {
  command: command
  page: string
}

//  : WebviewMessage()
export interface ChatModelWebviewMessage {
  command: command
  model: string
}

//  : WebviewMessage()
export interface Get-chat-modelsWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface OpenFileWebviewMessage {
  command: command
  uri: Uri
  range?: RangeData
}

//  : WebviewMessage()
export interface OpenLocalFileWithRangeWebviewMessage {
  command: command
  filePath: string
  range?: RangeData
}

//  : WebviewMessage()
export interface EditWebviewMessage {
  command: command
  addEnhancedContext?: boolean
  contextFiles?: ContextItem[]
  text: string
  index?: int
  editorState?: any
}

//  : WebviewMessage()
export interface Context_get-remote-search-reposWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface Context_choose-remote-search-repoWebviewMessage {
  command: command
  explicitRepos?: Repo[]
}

//  : WebviewMessage()
export interface Context_remove-remote-search-repoWebviewMessage {
  command: command
  repoId: string
}

//  : WebviewMessage()
export interface Embeddings_indexWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface Symf_indexWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface InsertWebviewMessage {
  command: command
  text: string
}

//  : WebviewMessage()
export interface NewFileWebviewMessage {
  command: command
  text: string
}

//  : WebviewMessage()
export interface CopyWebviewMessage {
  command: command
  eventType: String
  text: string
}

//  : WebviewMessage()
export interface AuthWebviewMessage {
  command: command
  authKind: String
  endpoint?: string
  value?: string
  authMethod?: AuthMethod
}

//  : WebviewMessage()
export interface AbortWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface Simplified-onboardingWebviewMessage {
  command: command
  onboardingKind: onboardingKind
}

//  : WebviewMessage()
export interface GetUserContextWebviewMessage {
  command: command
  query: string
  range?: RangeData
}

//  : WebviewMessage()
export interface SearchWebviewMessage {
  command: command
  query: string
}

//  : WebviewMessage()
export interface Show-search-resultWebviewMessage {
  command: command
  uri: Uri
  range: RangeData
}

//  : WebviewMessage()
export interface ResetWebviewMessage {
  command: command
}

//  : WebviewMessage()
export interface Attribution-searchWebviewMessage {
  command: command
  snippet: string
}

//  : WebviewMessage()
export interface Troubleshoot_reloadAuthWebviewMessage {
  command: command
}

// AuthMethod
typealias AuthMethod = dotcom | github | gitlab | google

// ChatSubmitType
typealias ChatSubmitType = user | user-newchat

// TelemetryEventProperties
// undefined
export interface TelemetryEventProperties {
  key: string
}

// Webview_DidDisposeParams
// undefined
export interface Webview_DidDisposeParams {
  id: string
}

// Git_CodebaseNameParams
// undefined
export interface Git_CodebaseNameParams {
  url: string
}

// Graphql_GetRepoIdParams
// undefined
export interface Graphql_GetRepoIdParams {
  repoName: string
}

// Graphql_GetRepoIdIfEmbeddingExistsParams
// undefined
export interface Graphql_GetRepoIdIfEmbeddingExistsParams {
  repoName: string
}

// TelemetryEvent
// undefined
export interface TelemetryEvent {
  feature: string
  action: string
}

// Event
// undefined
export interface Event {
  event: string
  userCookieID: string
  url: string
  source: string
  argument?: string
  publicArgument?: string
  client: string
  connectedSiteID?: string
  hashedLicenseKey?: string
}

// CurrentUserCodySubscription
// undefined
export interface CurrentUserCodySubscription {
  status: string
  plan: string
  applyProRateLimits: boolean
  currentPeriodStartAt: Date
  currentPeriodEndAt: Date
}

// FeatureFlags_GetFeatureFlagParams
// undefined
export interface FeatureFlags_GetFeatureFlagParams {
  flagName: string
}

// Graphql_GetRepoIdsResult
// undefined
export interface Graphql_GetRepoIdsResult {
  repos: ReposParams[]
}

// ReposParams
// undefined
export interface ReposParams {
  name: string
  id: string
}

// Graphql_GetRepoIdsParams
// undefined
export interface Graphql_GetRepoIdsParams {
  names: string[]
  first: int
}

// AutocompleteResult
// undefined
export interface AutocompleteResult {
  items: AutocompleteItem[]
  completionEvent?: CompletionBookkeepingEvent
}

// CompletionBookkeepingEvent
// undefined
export interface CompletionBookkeepingEvent {
  id: CompletionLogID
  startedAt: int
  networkRequestStartedAt?: int
  startLoggedAt?: int
  loadedAt?: int
  suggestedAt?: int
  suggestionLoggedAt?: int
  suggestionAnalyticsLoggedAt?: int
  acceptedAt?: int
  items: CompletionItemInfo[]
  loggedPartialAcceptedLength: int
}

// CompletionItemInfo
// undefined
export interface CompletionItemInfo {
  parseErrorCount?: int
  lineTruncatedCount?: int
  truncatedWith?: String
  nodeTypes?: NodeTypesParams
  nodeTypesWithCompletion?: NodeTypesWithCompletionParams
  lineCount: int
  charCount: int
  insertText?: string
  stopReason?: string
}

// NodeTypesWithCompletionParams
// undefined
export interface NodeTypesWithCompletionParams {
  atCursor?: string
  parent?: string
  grandparent?: string
  greatGrandparent?: string
  lastAncestorOnTheSameLine?: string
}

// NodeTypesParams
// undefined
export interface NodeTypesParams {
  atCursor?: string
  parent?: string
  grandparent?: string
  greatGrandparent?: string
  lastAncestorOnTheSameLine?: string
}

// CompletionLogID
// undefined
export interface CompletionLogID {
  _opaque: any
}

// AutocompleteItem
// undefined
export interface AutocompleteItem {
  id: string
  insertText: string
  range: Range
}

// AutocompleteParams
// undefined
export interface AutocompleteParams {
  uri: string
  filePath?: string
  position: Position
  triggerKind?: String
  selectedCompletionInfo?: SelectedCompletionInfo
}

// SelectedCompletionInfo
// undefined
export interface SelectedCompletionInfo {
  range: Range
  text: string
}

// ExecuteCommandParams
// undefined
export interface ExecuteCommandParams {
  command: string
  arguments?: any[]
}

// GetFoldingRangeResult
// undefined
export interface GetFoldingRangeResult {
  range: Range
}

// GetFoldingRangeParams
// undefined
export interface GetFoldingRangeParams {
  uri: string
  range: Range
}

// EditTask_CancelParams
// undefined
export interface EditTask_CancelParams {
  id: FixupTaskID
}

// FixupTaskID
// undefined
export interface FixupTaskID {
}

// EditTask_UndoParams
// undefined
export interface EditTask_UndoParams {
  id: FixupTaskID
}

// EditTask_AcceptParams
// undefined
export interface EditTask_AcceptParams {
  id: FixupTaskID
}

// EditCommands_CodeParams
// undefined
export interface EditCommands_CodeParams {
  instruction: string
  model: string
}

// CustomCommandResult

export interface CustomCommandResult {
}

//  : CustomCommandResult()
export interface CustomChatCommandResult {
  type: type
  chatResult: string
}

//  : CustomCommandResult()
export interface CustomEditCommandResult {
  type: type
  editResult: EditTask
}

// Commands_CustomParams
// undefined
export interface Commands_CustomParams {
  key: string
}

// Chat_EditMessageParams
// undefined
export interface Chat_EditMessageParams {
  id: string
  message: WebviewMessage
}

// Chat_SubmitMessageParams
// undefined
export interface Chat_SubmitMessageParams {
  id: string
  message: WebviewMessage
}

// Chat_RemoteReposResult
// undefined
export interface Chat_RemoteReposResult {
  remoteRepos?: Repo[]
}

// Chat_RemoteReposParams
// undefined
export interface Chat_RemoteReposParams {
  id: string
}

// ChatExportResult
// undefined
export interface ChatExportResult {
  chatID: string
  transcript: SerializedChatTranscript
}

// SerializedChatTranscript
// undefined
export interface SerializedChatTranscript {
  id: string
  chatModel?: string
  chatTitle?: string
  interactions: SerializedChatInteraction[]
  lastInteractionTimestamp: string
  enhancedContext?: EnhancedContextParams
}

// EnhancedContextParams
// undefined
export interface EnhancedContextParams {
  selectedRepos: SelectedReposParams[]
}

// SelectedReposParams
// undefined
export interface SelectedReposParams {
  id: string
  name: string
}

// SerializedChatInteraction
// undefined
export interface SerializedChatInteraction {
  humanMessage: SerializedChatMessage
  assistantMessage?: SerializedChatMessage
}

// Chat_ModelsResult
// undefined
export interface Chat_ModelsResult {
  models: ModelProvider[]
}

// Chat_ModelsParams
// undefined
export interface Chat_ModelsParams {
  modelUsage: ModelUsage
}

// ModelUsage
typealias ModelUsage = chat | edit

// Chat_RestoreParams
// undefined
export interface Chat_RestoreParams {
  modelID?: string
  messages: SerializedChatMessage[]
  chatID: string
}

// ServerInfo
// undefined
export interface ServerInfo {
  name: string
  authenticated?: boolean
  codyEnabled?: boolean
  codyVersion?: string
  authStatus?: AuthStatus
}

// ClientInfo
// undefined
export interface ClientInfo {
  name: string
  version: string
  workspaceRootUri: string
  workspaceRootPath?: string
  extensionConfiguration?: ExtensionConfiguration
  capabilities?: ClientCapabilities
}

// ClientCapabilities
// undefined
export interface ClientCapabilities {
  completions?: completions
  chat?: String
  git?: String
  progressBars?: String
  edit?: String
  editWorkspace?: String
  untitledDocuments?: String
  showDocument?: String
  codeLenses?: String
  showWindowMessage?: String
  ignore?: String
}
