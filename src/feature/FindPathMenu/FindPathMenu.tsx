import { Alert, Button, Card, Flex, Form, Input } from 'antd';
import { useState } from 'react';

import { PathTree } from './ui/PathTree';
import { createPathMapFromPathMatrix } from './util/createPathMapFromPathMatrix';
import { getIdsOfPathNodes } from './util/getIdsOfPathNodes';

import { House } from '@/shared/Geometry/House';
import { Graph, Node as HouseNode } from '@/shared/utils/Graph';
import cn from 'classnames';
import './FindPathMenu.css';

interface PathPainterFeature {
  housePathGraph: Graph;
  highLightPath: (fromId: string, toId: string, color: 0x635c5a | 0x4096ff) => void;
}

interface HousePainterFeature {
  housesMap: Map<string, House>;
}

type PropsType = {
  pathPainter: PathPainterFeature | null;
  housePainter: HousePainterFeature | null;
};

export const FindPathMenu = ({ pathPainter, housePainter }: PropsType) => {
  const [pathsMap, setPathsMap] = useState<Map<string, HouseNode[]>>(new Map());
  const [findError, setFindError] = useState('');
  const [activePathId, setActivePathId] = useState('');
  const [activePath, setActivePath] = useState<HouseNode[]>([]);

  const handlePathClick = (nodesPath: HouseNode[]) => {
    setColorPathOfNodes(activePath, 0x635c5a);
    setColorPathOfNodes(nodesPath, 0x4096ff);

    setActivePathId(nodesPath.map(({ id }) => id).join());
    setActivePath(nodesPath);
  };

  const setColorPathOfNodes = (nodesPath: HouseNode[], color: 0x635c5a | 0x4096ff) => {
    if (!pathPainter) return;

    for (let i = 0; i < nodesPath.length - 1; i++) {
      const currentNode = nodesPath[i];
      const nextNode = nodesPath[i + 1];

      pathPainter.highLightPath(currentNode.id, nextNode.id, color);
    }
  };

  const handleSearchPath = async (values: { from: string; to: string }) => {
    const housePathGraph = pathPainter?.housePathGraph;
    const housesMap = housePainter?.housesMap;

    if (!housePathGraph || !housesMap) return;

    const allHousesInfo = [...housesMap.values()];

    const { nodeFromId, nodeToId } = getIdsOfPathNodes(values.from, values.to, allHousesInfo);

    const nodeFrom = housePathGraph.map.get(nodeFromId);
    const nodeTo = housePathGraph.map.get(nodeToId);

    const hasNodes = nodeTo && nodeFrom;

    if (!hasNodes) {
      setFindError('Route not found');
      return;
    }

    const possiblePathMatrix = housePathGraph.getAllPaths(nodeFrom, nodeTo);
    const pathsMap = createPathMapFromPathMatrix(possiblePathMatrix);

    setPathsMap(pathsMap);
    setFindError(possiblePathMatrix.length === 0 ? 'Route not found' : '');
  };

  if (!pathPainter || !housePainter) return <></>;

  return (
    <Card rootClassName='find-path-container' title='Find route'>
      <Form onFinish={handleSearchPath}>
        <Flex gap='middle' vertical>
          <Form.Item
            name='from'
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input placeholder='From' />
          </Form.Item>

          <Form.Item
            name='to'
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input placeholder='To' />
          </Form.Item>

          <Button htmlType='submit' type='primary'>
            Find
          </Button>
        </Flex>
      </Form>

      {findError ? (
        <Alert type='info' message={findError} style={{ marginTop: '20px' }} />
      ) : (
        <div>
          {[...pathsMap.entries()].map(([pathId, path]) => (
            <Alert
              key={pathId}
              onClick={() => handlePathClick(path)}
              className={cn('path-container', { active: pathId === activePathId })}
              description={<PathTree path={path} housesMap={housePainter.housesMap} />}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
