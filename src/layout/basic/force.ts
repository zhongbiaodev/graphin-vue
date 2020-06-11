import ForceLayout, { ForceProps } from '../force/ForceLayout';
import { optimizeDrawing, optimizeDrawingByNode } from '../../perf/optimizeDrawing';

import { LayoutOptionBase, Data, Node as NodeType, ForceSimulation, ExtendedGraph } from '../../types';

import forceWithWorker from './forceWithWorker';

export interface ForceLayoutOptions extends ForceProps, LayoutOptionBase {
  isOptimization?: boolean;
}
interface Return {
  data: Data;
  simulation: ForceSimulation;
}

const forceLayout = (data: Data, options: ForceLayoutOptions): Return => {
  const {
    width,
    height,
    graph,
    enableWorker = false,
    animation,
    // eslint-disable-next-line
    done = (_graph: any) => {},
    isOptimization,
    ...others
  } = options;

  /** Webworker solution. Otherwise, browser UI rendering is blocked */
  if (enableWorker && data.nodes.length > 100) {
    // 100以下的节点不走webworker
    return forceWithWorker(data, options);
  }

  /** 1. Create a force simulator */
  const simulation = new ForceLayout({
    width,
    height,
    animation: animation !== undefined ? animation : true,
    done: () => {
      if (isOptimization) {
        optimizeDrawing(graph as ExtendedGraph, false);
      }
      graph.emit('forcelayoutdone')
      done(graph);
    },
    ...others,
  });

  // 2. Mount Data
  simulation.setData(data);

  // 3. Custom rendering function
  simulation.register('render', (forceData: Data) => {
    try {
      forceData.nodes.forEach((item: NodeType) => {
        const node = graph.findById(item.id);
        if (node) {
          // 因为有可能画布删除了节点
          const model = node.get('model');
          model.x = item.x;
          model.y = item.y;
          if (isOptimization) {
            optimizeDrawingByNode(true, node);
          }
        }
      });
      graph.refreshPositions();
      graph.emit('render')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  });
  /**  4. Start force  simulator */
  simulation.start();

  return {
    data,
    simulation,
  };
};
export default forceLayout;
