// @flow

import React from 'react';
import { Row, Col } from 'antd';
import api from '../shared/api.json';
import Player from './player';

export default () => (
  <Row>
    <Col sm={6} md={4} />
    <Col sm={12} md={16}>
      <div className="wrapper">
        {
          api.competitors.map(({ competitor }) => (
            <div>
              {
                competitor.players.map(({ player, team }) =>
                  <Player {...player} team={team.id} />)
              }
            </div>
          ))
        }
        <style jsx>{`
          .wrapper {
            display: flex;
            flex-direction: row;
          }
        `}
        </style>
      </div>
    </Col>
  </Row>
);
