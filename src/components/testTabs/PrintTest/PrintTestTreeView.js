import React, { useState, useEffect }  from 'react'
import { Tree } from "@minoru/react-dnd-treeview";
import '../../TreeViewTestCreate.css';

const PrintTestTreeView = React.forwardRef(
  ({ data, renderQuestions }, ref) => {
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
      setTreeData(renderTreeNodes(data));
    }, [data, renderQuestions]);
  
    const renderTreeNodes = (nodes) => {
      return nodes.map((node, index) => ({
        id: node.itemId || "",
        content: renderQuestions(node, index),
        children:
          node.children && node.children.length > 0
            ? renderTreeNodes(node.children)
            : undefined,
      }));
    };

    return (
      <div className={`p-3`} ref={ref} id="element">
        <div className='question-numbers'>With and Without metadata - {treeData?.length} Questions
          {treeData && (
            <Tree className="print-test-treeview"
              tree={treeData}
              render={(node) => <div>{node.content}</div>}
            />
          )}
        </div>
        {treeData.map((item, index) => {
          return (
            <div key={index} className={`saved-content fs-6`}>
              {Array.from({ length: item.spaceLine }, (_, spaceIndex) => (
                <div key={spaceIndex} className="w-100 p-3 bg-light mx-2"></div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
);

// function PrintTestTreeView({ data, renderQuestions }, ref) {
//     const [treeData, setTreeData] = useState([]);
  
//     useEffect(() => {
//       setTreeData(renderTreeNodes(data));
//     }, [data, renderQuestions]);
  
//     const renderTreeNodes = (nodes) => {
//       return nodes.map((node, index) => ({
//         id: node.itemId || "",
//         content: renderQuestions(node, index),
//         children:
//           node.children && node.children.length > 0
//             ? renderTreeNodes(node.children)
//             : undefined,
//       }));
//     };
  
//     return (
//       <div className="tree-container" ref={ref}>
//         <div>
//           {treeData && (
//             <Tree
//               tree={treeData}
//               render={(node) => <div>{node.content}</div>}
//             />
//           )}
//         </div>
//         {treeData.map((item, index) => {
//           return (
//             <div key={index} className={`saved-content fs-6`}>
//               {Array.from({ length: item.spaceLine }, (_, spaceIndex) => (
//                 <div key={spaceIndex} className="w-100 p-3 bg-light mx-2"></div>
//               ))}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

export default PrintTestTreeView;