import { State } from './index';
import { MeshAPI, ProjectsProjectUuidGetResponse } from 'mesh-api-client';
import defaultCompleter from './completers/default';
import nodeChildrenCompleter from './completers/nodechildren';

type Completer = (mesh: MeshAPI, line: string, cmd: string[], state: State) => Promise<[string[], string]>;

interface CompleterTable { [key: string]: Completer }

let defaultNodeChildrenQuery = (state, mesh) => mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children;
let uuidReducer = (prev, node) => prev.concat(node.uuid);

export const COMPLETERS: CompleterTable = {
    defaultCompleter: defaultCompleter,
    cd: nodeChildrenCompleter(
        defaultNodeChildrenQuery,
        (node, cmd) => node.container && (node.uuid.indexOf(cmd[1]) === 0 || node.fields.name.indexOf(cmd[1]) === 0),
        uuidReducer
    ),
    project: nodeChildrenCompleter<ProjectsProjectUuidGetResponse>(
        (state, mesh) => mesh.api.projects,
        (node, cmd) => node.name.indexOf(cmd[1]) === 0,
        (prev, node) => prev.concat(node.name)
    ),
    read: nodeChildrenCompleter(
        defaultNodeChildrenQuery,
        (node, cmd) => node.uuid.indexOf(cmd[1]) === 0,
        uuidReducer
    )
}