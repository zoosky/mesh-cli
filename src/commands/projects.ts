import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';

export default async function projects(mesh: MeshAPI, cmd: string[], state: State): Promise<State> {
  return new Promise<State>(async (resolve, reject) => {
    await mesh.api.projects.get().then((ps) => {
      console.log(ps.data.reduce((out, p) => {
        return `${out} ${p.name}`;
      }, ''));
    });
    resolve(state);
  });
}