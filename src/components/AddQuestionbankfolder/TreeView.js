import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import TreeNode from './TreeNode';

const TreeView = ({ selectedItems, onSelectItem, searchTerm, treeData }) => {
  /**
   * Filters an array of nodes based on a search term and whether or not the nodes are book nodes.
   * @param {Object[]} nodes - The array of nodes to filter.
   * @param {string} term - The search term to use when filtering the nodes.
   * @param {boolean} isBookNode - Whether or not the nodes are book nodes.
   * @returns {Object[]} The filtered array of nodes.
   */
  const filterNodes = (nodes, term, isBookNode) => {
    return nodes.flatMap(node => {
      // if (!isBookNode && node.droppable) {
      //   return []; // Exclude discipline nodes when searching for books
      // }

      // Recursively filter child nodes
      const filteredChildNodes = filterNodes(node.nodes || [], term, isBookNode || node.droppable);

      // If there are any matching child nodes, return the current node with the filtered child nodes
      if (filteredChildNodes.length > 0) {
        return [{ ...node, nodes: filteredChildNodes }];
      }

      // If this is a book node and the text matches the search term, return the current node with an empty array of child nodes
      if (isBookNode && node.text.toLowerCase().includes(term.toLowerCase())) {
        return [{ ...node, nodes: [] }];
      }

      // If neither of the above conditions are met, return an empty array
      return [];
    });
  };

  /**
   * A memoized version of the filtered tree data based on the search term.
   * @type {Object[]}
   */
  const filteredTreeData = useMemo(() => {
    return searchTerm ? filterNodes(treeData, searchTerm, false) : treeData;
  }, [searchTerm, treeData]);

  return (
    <div className="treeview">
      {searchTerm && filteredTreeData.length === 0 ? (
        <div className="no-matching-books-message">
          <FormattedMessage id="no_matching_books_message" defaultMessage="No matching books found" />
        </div>
      ) : (
        filteredTreeData.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            onSelectItem={onSelectItem}
            selectedItems={selectedItems}
            searchTerm={searchTerm}
          />
        ))
      )}
    </div>
  );
};

export default TreeView;
