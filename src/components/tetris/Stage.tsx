import React from 'react'
import { ModelStage, ModelBlock, ModelUserBlock } from './typeModels'
import { Cell as StyledCell, Stage as StyledStage, Row as StyledRow } from './styles/stage'

interface StageState {
  stage: ModelStage;
  userBlock: ModelUserBlock;
  predictionBlocks: ModelBlock[];
}
interface StageProps {
  level: number;
  gameStatus: 'beforePlay' | 'play' | 'pause' | 'gameOver';
  // save data
  dataPredictionBlocks: ModelBlock[];
  dataStage: ModelStage;
  dataUserBlock: ModelUserBlock;
  keyCode: {
    left: number;
    right: number;
    down: number;
    rotate: number;
    pastDown: number;
  }
}

export default class Stage extends React.Component<StageProps, StageState> {
  private get timerSpeed () {
    // millisecond at one y line block drop
    // 20 level === 200, 1 level === 4000
    return 4000 - 200 * (this.props.level - 1)
  }
  event: { timerId: number | boolean, key: boolean } = {
    key: false,
    timerId: false
  }

  shapeBlockPosPareser(block: ModelUserBlock): [number, number][] {
    const pos: [number, number][] = []
    block.shape.forEach((row, rowIndex) => {
      row.forEach((ySettle, yIndex) => {
        if (ySettle) {
          pos.push([
            block.standardPos[0] + rowIndex,
            block.standardPos[1] + yIndex
          ])
        }
      })
    })

    return pos
  }
  getConcatStageByBlock({ pos, background }: { pos: [number, number][]; background: string }, isSettle: boolean, stage?: ModelStage): ModelStage {
    const copyStage = stage ? [...stage] : [...this.state.stage]

    pos.forEach(posItem => {
      copyStage[posItem[0]][posItem[1]] = {
        background,
        settle: isSettle
      }
    })

    return copyStage
  }

  eventHandler (key: 'addKey' | 'removeKey' | 'addTimer' | 'removeTimer') {
    switch (key) {
      case 'addKey':
        if (!this.event.key) {
          this.event.key = true
        }
        break;
      default:
        break;
    }
  }

  keyboardEvent (e: KeyboardEvent) {
    switch (e.keyCode) {
      case this.props.keyCode.left:
        break;
      case this.props.keyCode.right:
        break;
      case this.props.keyCode.down:
        break;
      case this.props.keyCode.rotate:
        break;
      case this.props.keyCode.pastDown:
        break;
    }
  }
 
  constructor (props: StageProps) {
    super(props)

    this.state = {
      stage: props.dataStage,
      userBlock: props.dataUserBlock,
      predictionBlocks: props.dataPredictionBlocks
    }
  }

  shouldComponentUpdate (nextProps: StageProps) {
    if (this.props.gameStatus !== nextProps.gameStatus) return true
    else return false
  }

  render () {
    return (
      <StyledStage cellCount={this.state.stage.length}>
        {
          this.state.stage.map((rows, xIndex) => (
            <StyledRow key={`tetris__x-${xIndex}`}>
              {
                rows.map((cell, yIndex) => (
                  <StyledCell {...cell} key={`tetris__x-${xIndex}-${yIndex}`} />
                ))
              }
            </StyledRow>
          ))
        }
      </StyledStage>
    )
  }
}
