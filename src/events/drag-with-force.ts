import Graphin from '../Graphin.vue';
import { G6Event } from '../types';

const dragWithForce = (graphin: Graphin) => {
  const { graph, g6Options } = graphin;

  const { autoFollowWithForce = true, autoPinWithForce = true, restartForceOnDrag = true } = g6Options!;
  let dragStartX = 0;
  let dragStartY = 0;
  graph!.on('', () => {

  })

  /** 拖拽Force节点：start */
  graph!.on('node:dragstart', (e: G6Event) => {
    if (graphin.forceSimulation) {
      graphin.forceSimulation.stop();
    }
    dragStartX = e.x
    dragStartY = e.y
    const nodeModel = e.item.get('model');
    console.log('nodeModel', nodeModel)
    console.log('dragstart', e)
  });

  /** 拖拽结束 */
  graph!.on('node:dragend', (e: G6Event) => {
    if (graphin.forceSimulation && autoFollowWithForce && restartForceOnDrag) {
      console.log('dragend', e)
      const nodeModel = e.item.get('model');
      // nodeModel.x += (e.x - dragStartX);
      // nodeModel.y += (e.y - dragStartY);
      nodeModel.x = e.x
      nodeModel.y = e.y
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
