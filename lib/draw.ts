import * as tslab from 'tslab';
import * as util from 'util';
import { v4 as uuidv4 } from 'uuid';

import * as list from './list';
import * as tree from './tree';
import * as introspect from './introspect';


export function requireCarbon() {
  tslab.display.html(`
  <link rel="stylesheet" href="node_modules/carbon-components/css/carbon-components.css">
  `);
}
// <script src="node_modules/carbon-components/scripts/carbon-components.min.js"></script>


export function requireCytoscape() {
  tslab.display.html(`
<script>
require.config({
     paths: {
     cytoscape: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.19.0/cytoscape.min'
}});
</script>
  `);
}


const nodeStyle = `
{
  selector: 'node',
  css: {
    'class': ".bx--tree",
    'label': 'data(label)',
  }
},
{
  selector: 'edge',
  css: {
    'width': 3,
//                 'line-color': '#ccc123',
    'curve-style': 'bezier',
    'target-arrow-shape': 'triangle',
    'target-arrow-fill': 'filled',
    'arrow-scale': 1,
  }
}
`;

export const listLayout = `{}`;


export const treeLayout = `
{
  name: 'breadthfirst',
  directed: true,
  padding: 10
}
`;


export function draw(elems, width=800, height=350, layout=listLayout) {
  const divId = "mydiv" + uuidv4();
tslab.display.html(`
<style>
    #${divId} {
        width: ${width}px;
        height: ${height}px;
        // position: absolute;
        top: 0px;
        left: 0px;
    }
</style>
<div id="${divId}"></div>
`);
tslab.display.html(`
<script>
 (function(element) {
     require(['cytoscape'], function(cytoscape) {   
        var cy = cytoscape({
         container: document.getElementById('${divId}'),
         style: [${nodeStyle}],
         layout: ${layout},
         elements: ${elems}
         });
     });
 })(this.element);
</script>
`);
}


export function drawList<T>(ls: list.List<T>, width=800, height=350) {
  return draw(list.cytoscapify(ls), width, height, listLayout);
}


export function drawTree<T>(t: tree.Tree<T>, width=800, height=350) {
  return draw(tree.cytoscapify(t), width, height, treeLayout);
}


export function drawMemTrace(memTrace, i, width=800, height=350) {
  return draw(introspect.cytoscapifyMemTrace(memTrace.trace[i], memTrace.refId), width, height);
}


export function drawCallStack(stk: [string, number, any][], width=800, height=350) {
  draw(introspect.cytoscapifyCallStack(stk), width, height, treeLayout);
}
