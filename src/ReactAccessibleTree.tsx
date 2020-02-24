import * as React from "react";

export interface ISearchMethodParams {
  // tslint:disable-next-line: no-any
  node: any;
  path: number[] | string[];
  treeIndex: number;
  // tslint:disable-next-line: no-any
  searchQuery: any;
}

export interface ITreeNode<T = {}> {
  title: string | React.ReactNode;
  children: ITreeNode[];
  searchKeys: string[];
  id: string;
  extra?: T;
  expanded?: boolean;
  selected?: boolean;
  isTag?: boolean;
  ariaLabel?: string;
}

export interface IAccessibleTreeStyles {
  root?: Partial<React.CSSProperties>;
  group?: Partial<React.CSSProperties>;
  item?: Partial<React.CSSProperties>;
}

interface IProps {
  treeData: ITreeNode[];
  styles?: IAccessibleTreeStyles;
  onChange(data: ITreeNode[]): void;
  onRenderItem?(item: ITreeNode): React.ReactNode;
  onItemKeyDown?(evt: React.KeyboardEvent, item: ITreeNode): void;
}

export const ReactAccessibleTree: React.FunctionComponent<IProps> = props => {
  // space is cheap, time is expensive.
  const allDataLinkedList: string[] = [];
  const parentsMap = new Map<string, string | void>();
  const allNodesLinkedList: ITreeNode[] = [];

  const getNextNode = (id: string): string | void => {
    const currentIndex = allDataLinkedList.indexOf(id);

    return allDataLinkedList[currentIndex + 1];
  };

  const getPrevNode = (id: string): string | void => {
    const currentIndex = allDataLinkedList.indexOf(id);

    return allDataLinkedList[currentIndex - 1];
  };

  const getParentNode = (id: string): string | void => {
    return parentsMap.get(id);
  };

  const getUpdatedChildren = (
    id: string,
    state: Partial<ITreeNode>,
    children: ITreeNode[]
  ): ITreeNode[] => {
    return children.map(item => {
      if (item.id !== id) {
        return {
          ...item,
          children: getUpdatedChildren(id, state, item.children),
          selected: false
        };
      }

      return {
        ...item,
        children: getUpdatedChildren(id, state, item.children),
        selected: true,
        ...state
      };
    });
  };

  const updateListItem = (id: string, state: Partial<ITreeNode>): void => {
    const nextData: ITreeNode[] = getUpdatedChildren(id, state, props.treeData);

    props.onChange(nextData);
  };

  const expandAllChildren = (data: ITreeNode[]): ITreeNode[] => {
    return data.map(item => ({
      ...item,
      expanded: true,
      children: expandAllChildren(item.children)
    }));
  };

  const expandAllNode = (): void => {
    const nextData: ITreeNode[] = expandAllChildren(props.treeData);

    props.onChange(nextData);
  };

  const defaultRenderItem = (current: ITreeNode): React.ReactNode =>
    current.title;

  const checkIsGroupSelected = (item: ITreeNode): boolean => {
    return (
      item.selected || item.children.filter(checkIsGroupSelected).length > 0
    );
  };

  const focusById = (id: string): void => {
    updateListItem(id, {});
  };

  const focusNextNode = (id: string): void => {
    const nextNodeId = getNextNode(id);

    if (nextNodeId) {
      focusById(nextNodeId);
    }
  };

  const focusPreviousNode = (id: string): void => {
    const prevNodeId = getPrevNode(id);

    if (prevNodeId) {
      focusById(prevNodeId);
    }
  };

  const focusParentNode = (id: string): void => {
    const parentNodeId = getParentNode(id);

    if (parentNodeId) {
      focusById(parentNodeId);
    }
  };

  const focusFirstNode = (): void => {
    if (allDataLinkedList.length > 0) {
      focusById(allDataLinkedList[0]);
    }
  };

  const focusLastNode = (): void => {
    if (allDataLinkedList.length > 0) {
      focusById(allDataLinkedList[allDataLinkedList.length - 1]);
    }
  };

  const getNextNodeIdMatchesKey = (key: string, currentId: string): string => {
    const currentNodeIndex = allDataLinkedList.indexOf(currentId);
    const isMatch = (item: ITreeNode): boolean => {
      return item.searchKeys.some(searchKey =>
        searchKey.match(new RegExp(`^${key}`, "i"))
      );
    };

    const beforeNodes = [...allNodesLinkedList].slice(0, currentNodeIndex + 1);
    const afterNodes = [...allNodesLinkedList].slice(currentNodeIndex + 1);
    const firstMatchInAfterNode = afterNodes.filter(isMatch)[0];

    if (!firstMatchInAfterNode) {
      const firstMatchInBeforeNode = beforeNodes.filter(isMatch)[0];

      return firstMatchInBeforeNode ? firstMatchInBeforeNode.id : currentId;
    }

    return firstMatchInAfterNode.id;
  };

  const getKeyboardEventHandler = (item: ITreeNode) => (
    e: React.KeyboardEvent
  ) => {
    const isAToZKey = e.keyCode >= 65 && e.keyCode <= 90;

    if (isAToZKey) {
      e.preventDefault();
      e.stopPropagation();
      const nextNodeIdMatchKey = getNextNodeIdMatchesKey(e.key, item.id);

      focusById(nextNodeIdMatchKey);

      return;
    }

    const handlerMap = new Map<string, () => void>();

    handlerMap.set("ArrowDown", () => {
      focusNextNode(item.id);
    });

    handlerMap.set("ArrowUp", () => {
      focusPreviousNode(item.id);
    });

    handlerMap.set("ArrowRight", () => {
      if (item.children.length === 0) {
        return;
      }

      if (item.expanded) {
        focusNextNode(item.id);
        return;
      }

      updateListItem(item.id, { expanded: true, selected: item.selected });
    });

    handlerMap.set("ArrowLeft", () => {
      if (item.expanded && item.children.length > 0) {
        updateListItem(item.id, { expanded: false, selected: item.selected });
        return;
      }

      focusParentNode(item.id);
    });

    handlerMap.set("Home", () => {
      focusFirstNode();
    });

    handlerMap.set("End", () => {
      focusLastNode();
    });

    handlerMap.set("*", () => {
      expandAllNode();
    });

    const handler = handlerMap.get(e.key);

    if (handler) {
      e.preventDefault();
      e.stopPropagation();
      handler();
    } else if (props.onItemKeyDown) {
      props.onItemKeyDown.apply(undefined, [e, item]);
    }
  };

  const isNoItemSelected =
    props.treeData.filter(checkIsGroupSelected).length === 0;

  let isFirstItem = true;

  const getTabIndex = (item: ITreeNode) => {
    if (item.selected || (isFirstItem && isNoItemSelected)) {
      return 0;
    }

    return -1;
  };

  const renderChildren = (
    data: ITreeNode[],
    parentId?: string
  ): React.ReactNodeArray => {
    return data.map(item => {
      allDataLinkedList.push(item.id);
      allNodesLinkedList.push(item);

      if (parentId) {
        parentsMap.set(item.id, parentId);
      }

      const isLeaf = item.children.length > 0;
      const isChildrenVisible = isLeaf && item.expanded;

      const onItemTitleClick = (e: React.MouseEvent): void => {
        e.preventDefault();

        if (item.children.length === 0) {
          return;
        }

        updateListItem(item.id, {
          expanded: !item.expanded,
          selected: item.selected
        });
      };

      const key = item.id;
      const itemStyle = props.styles && props.styles.item;
      const groupStyle = props.styles && props.styles.group;
      const tabIndex = getTabIndex(item);

      const listItemProps = {
        style: itemStyle,
        tabIndex
      };

      if (!isLeaf) {
        listItemProps["aria-expanded"] = item.expanded;
      }

      isFirstItem = false;

      const onItemFocus = (e: React.FocusEvent) => {
        e.preventDefault();
        e.stopPropagation();

        focusById(item.id);
      };

      const onItemBlur = (e: React.FocusEvent) => {
        e.preventDefault();

        updateListItem(item.id, { selected: false });
      };

      const onItemTitleKeyboardEvent = getKeyboardEventHandler(item);

      const itemRef = (li: HTMLLIElement | null) => {
        if (item.selected && li) {
          li.focus();
        }
      };

      const ariaExpanded = item.expanded ? "true" : "false";

      return (
        <li
          key={key}
          role="treeitem"
          aria-selected={item.selected}
          aria-expanded={ariaExpanded}
          {...listItemProps}
          onFocus={onItemFocus}
          onBlur={onItemBlur}
          onKeyDown={onItemTitleKeyboardEvent}
          data-item-id={item.id}
          ref={itemRef}
        >
          <span onClick={onItemTitleClick} role="button">
            {props.onRenderItem
              ? props.onRenderItem(item)
              : defaultRenderItem(item)}
          </span>
          {isChildrenVisible && (
            <ul role="group" style={groupStyle}>
              {renderChildren(item.children, item.id)}
            </ul>
          )}
        </li>
      );
    });
  };

  const rootStyle = props.styles && props.styles.root;

  return (
    <ul role="tree" style={rootStyle}>
      {renderChildren(props.treeData)}
    </ul>
  );
};
