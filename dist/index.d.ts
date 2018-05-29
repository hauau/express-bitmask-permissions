import { PBMConfig } from './lib/utils';
declare const PBM: (options: PBMConfig) => (req: any, res: any, next: Function) => any;
export default PBM;
