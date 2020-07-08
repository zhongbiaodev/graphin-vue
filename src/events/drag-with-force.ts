import Graphin from '../Graphin.vue';
import { G6Event } from '../types';

const dragWithForce = (graphin: Graphin) => {
  const { graph, g6Options } = graphin;

  const { autoFollowWithForce = true, autoPinWithForce = true, restartForceOnDrag = true } = g6Options!;
  let disX = 0; // 拖拽点距离点的中心的x距离
  let disY = 0; // 拖拽点距离点的中心的y距离

  /** 拖拽Force节点：start */
  graph!.on('node:dragstart', (e: G6Event) => {
    if (graphin.forceSimulation) {
      graphin.forceSimulation.stop();
    }
    const nodeModel = e.item.get('model');
    disX = e.x - nodeModel.x
    disY = e.y - nodeModel.y
  });

  /** 拖拽结束 */
  graph!.on('node:dragend', (e: G6Event) => {
    if (graphin.forceSimulation && autoFollowWithForce && restartForceOnDrag) {
      const nodeModel = e.item.get('model');
      nodeModel.x = e.x - disX
      nodeModel.y = e.y - disY
      // 策略：拖拽后就定在拖拽处
      nodeModel.layout = {
        ...nodeModel.layout,
        force: {
          mass: autoPinWithForce ? 1000000 : null,
        },
      };
      // TODO :未来多选可以拖拽。
      const drageNodes = [nodeModel];

      graphin.forceSimulation.restart(drageNodes, graph!);
      graph!.refreshPositions();
    }
  });
};
export default dragWithForce;
