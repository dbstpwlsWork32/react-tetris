import React from 'react'
import { ModelScoreBoard, ModelStage, ModelBlock, ModelUserBlock } from './typeModels'
import ScoreBoard from './scoreBoard'
import Stage from './Stage'
import getBlock from './logic/block'

interface TetrisState {
  gameStatus: 'beforePlay' | 'play' | 'pause' | 'gameOver';
  scoreBoard: ModelScoreBoard;
  sendToStage: {
    stage: ModelStage;
    predictionBlocks: ModelBlock[];
    userBlock: ModelUserBlock;
    keyCode: {
      left: number,
      right: number,
      down: number,
      rotate: number,
      pastDown: number
    }
  }
}
interface TetrisData {
  stage?: ModelStage;
  scoreBoard?: ModelScoreBoard;
  predictionBlocks?: ModelBlock[];
  userBlock?: ModelUserBlock;
  keyCode?: {
    left: number,
    right: number,
    down: number,
    rotate: number,
    pastDown: number
  }
}
export default class Tetris extends React.PureComponent<TetrisData, TetrisState> {

  gameBtHandler () {
    switch (this.state.gameStatus) {
      case 'play':
        this.setState({
          gameStatus: 'pause'
        })
        break;
      default:
        this.setState({
          gameStatus: 'play'
        })
        break;
    }
  }

  constructor (props: TetrisData) {
    super(props)

    const stageX = 10
    const stageY = 20

    const newUserBlock = getBlock()
    this.state = {
      sendToStage: {
        stage:
          props.stage ||
          Array.from(new Array(stageX), () => new Array(stageY).fill({ backgrond: '', settle: false })),
        predictionBlocks: 
          props.predictionBlocks ||
          [getBlock(), getBlock(), getBlock()],
        userBlock:
          props.userBlock ||
          {
            ...newUserBlock,
            standardPos: [Math.floor((stageX - newUserBlock.shape.length) / 2), 0]
          },
        keyCode:
          props.keyCode ||
          {
            // left arrow
            left: 37,
            // right arrow
            right: 39,
            // down arrow
            down: 40,
            // s
            rotate: 89,
            // d
            pastDown: 68
          }
      },
      scoreBoard:
        props.scoreBoard ||
        {
          level: 1,
          score: 0,
          rows: 0
        },
      gameStatus: 'beforePlay',
    }

    this.gameBtHandler = this.gameBtHandler.bind(this)
  }

  render () {
    return (
      <div>
        <Stage
          dataStage={this.state.sendToStage.stage}
          dataPredictionBlocks={this.state.sendToStage.predictionBlocks}
          dataUserBlock={this.state.sendToStage.userBlock}
          level={this.state.scoreBoard.level}
          gameStatus={this.state.gameStatus}
          keyCode={this.state.sendToStage.keyCode}
        />
        <aside>
          <ScoreBoard {...this.state.scoreBoard} />
          <button onClick={this.gameBtHandler}>{
            this.state.gameStatus === 'play' ?
              'Pause' :
              'Play'
          }</button>
        </aside>
      </div>
    )
  }
}
