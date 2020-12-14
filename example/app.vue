<template>
  <article class="app">
    <header>
      graphType: {{ graphType }}
      <button @click="changeGraphType">改变图类型</button>
      <button @click="changeGraphOption">改变配置</button>
    </header>
    <Graphin
      ref="Graphin"
      :data="data"
      :layout="layout"
      :extend="extend"
      :options="options"
      :graphType="graphType"
    />
  </article>
</template>

<script lang="ts">
// import Graphin from '../dist/graphin-vue.min'
import Graphin from '../src/Graphin.vue'
import extend from './Extend'
export default {
  name: 'app',
  components: { Graphin },
  data () {
    return {
      graphType: 'Graph',
      extend,
      data: {
        nodes: [
          { id: '1', label: '1', text: '1', x: 50, y: 100,  data: { x: 50, y: 100 }, side: 'left' },
          { id: '2', label: '2', text: '2', x: 150, y: 100, data: { x: 150, y: 100 }, side: 'left' },
          { id: '3', label: '3', text: '3', x: 200, y: 100, data: {x: 200, y: 100} },
          { id: '4', label: '4', text: '4', x: 250, y: 100, data: {x: 250, y: 100}, side: 'right' },
          { id: '5', label: '5', text: '5', x: 250, y: 100, data: {x: 250, y: 100}, side: 'right' },
        ],
        edges: [
          { source: '1', target: '3', data: {} },
          { source: '2', target: '3', data: {} },
          { source: '3', target: '4', data: {} },
          { source: '3', target: '5', data: {} }
        ],
      },
      layout: {
          name: 'force',
          options: {
            // autoPinWithForce: true,
            autoFollowWithForce: false,
            // center: [window.innerWidth / 2, window.innerHeight / 2], // 可选，中心点坐标
            // nodeSize: [20, 20], // 可选，节点大小
            // nodesep: 12, // 可选, 节点水平间距(px)
            // ranksep: 10, // 可选, 每一层节点之间间距
            // align: "UL" // 可选, 放置位置
            // preset: {
            //   name: 'circle'
            // }
          }
      },
      options: {
        // autoPinWithForce: false,
        autoFollowWithForce: false,
      }
    }
  },
  mounted () {
    this.graph = this.$refs.Graphin.graph
    this.graph.on('afterlayout', () => {
      console.log(7777777777)
    })
    // setTimeout(() => {
    //   this.graph.getNodes().forEach(nodeInst => {
    //     const node = this.data.nodes.find(node => {
    //       console.log(node.id, nodeInst.getModel().id)
    //       return node.id === nodeInst.getModel().id
    //     })
    //     if (node) {
    //       nodeInst.update({ x: node.x, y: node.y })
    //     }
    //   })
    //   console.log(6)
    //   this.graph.refreshPositions()
    // }, 0)
  },
  methods: {
    changeGraphType() {
      if (this.graphType === 'Graph') {
        this.graphType = 'TreeGraph'
        this.layout = {
          name: 'mindmap',
          options: {
            // center: [window.innerWidth / 2, window.innerHeight / 2], // 可选，中心点坐标
            // nodeSize: [20, 20], // 可选，节点大小
            // nodesep: 12, // 可选, 节点水平间距(px)
            // ranksep: 10, // 可选, 每一层节点之间间距
            // align: "UL" // 可选, 放置位置
            direction: 'H',
            // getSide: (d) => {
            //   console.log('d', d)
            //   if (d.id === '1' || d.id === '2') {
            //     return 'left'
            //   }
            //   return 'right'
            // }
          }
        }
      } else {
        this.graphType = 'Graph'
        this.options.autoFollowWithForce = !this.options.autoFollowWithForce
        this.layout = {
          name: 'force',
          options: {
            // autoPinWithForce: this.options.autoFollowWithForce,
            autoFollowWithForce: this.options.autoFollowWithForce,
          }
        }
        console.log('layout', this.layout)
      }
    },
    changeGraphOption() {
      this.options.autoFollowWithForce = !this.options.autoFollowWithForce
      // this.layout.options.autoFollowWithForce = !this.layout.options.autoFollowWithForce
      // this.graph.refresh()
      console.log('graph', this.graph)
      this.graph.updateLayout({
        // name: 'force',
        autoFollowWithForce: this.options.autoFollowWithForce
      })
      // this.layout = {
      //   name: 'force',
      //   options: {
      //     // autoPinWithForce: this.options.autoFollowWithForce,
      //     autoFollowWithForce: !this.layout.options.autoFollowWithForce,
      //   }
      // }
      // const p = {
      //   data: this.data,
      //   options: this.options
      // }
      // this.graph.renderGraphWithLifeCycle(true);
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app #graphin-container {
  flex-grow: 1;
}
</style>
