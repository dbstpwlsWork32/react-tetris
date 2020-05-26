import React from 'react'
import { ModelStage, ModelBlock, ModelUserBlock } from './typeModels'
import { Cell as StyledCell, Stage as StyledStage, Row as StyledRow } from './styles/stage'
import getBlock from './logic/block'

interface ModelUserBlockStage extends ModelUserBlock {
  pos: [number, number][]
}

interface StageState {
  stage: ModelStage;
  userBlock: ModelUserBlockStage;
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
  };
  breakRowsEvent (rows: number): void;
  gameOverEvent (): void;
}

export default class Stage extends React.Component<StageProps, StageState> {
  private get timerSpeed () {
    // millisecond at one y line block drop
    // 20 level === 200, 1 level === 4000
    return 4000 - 200 * (this.props.level - 1)
  }
  event: { timerId: number | false, keyboard: boolean } = {
    keyboard: false,
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
  getStageConcatBlock (
    pos: [number, number][],
    background: string,
    isSettle: boolean,
    stage?: ModelStage
  ): ModelStage {
    const copyStage = stage ? [...stage] : [...this.state.stage]

    pos.forEach(posItem => {
      copyStage[posItem[0]][posItem[1]] = {
        background,
        settle: isSettle
      }
    })

    return copyStage
  }
  getStageRemoveBlock (pos: [number, number][], stage?: ModelStage): ModelStage {
    const copyStage = stage ? [...stage] : [...this.state.stage]

    pos.forEach(posItem => {
      copyStage[posItem[0]][posItem[1]] = {
        background: '',
        settle: false
      }
    })

    return copyStage
  }

  eventHandler (key: 'addKey' | 'removeKey' | 'addTimer' | 'removeTimer') {
    switch (key) {
      case 'addKey':
        if (!this.event.keyboard) {
          this.event.keyboard = true
          window.addEventListener('keydown', this.keyboardEvent)
        }
        break;
      case 'removeKey':
        if (this.event.keyboard) {
          this.event.keyboard = false
          window.removeEventListener('keydown', this.keyboardEvent)
        }
        break;
      case 'addTimer':
        if (this.event.timerId === false) {
          this.event.timerId = setInterval(this.timerEvent, this.timerSpeed)
        }
        break;
      case 'removeTimer':
        if (this.event.timerId !== false) {
          clearInterval(this.event.timerId)
          this.event.timerId = false
        }
        break
    }
  }

  keyboardEvent (e: KeyboardEvent) {
    switch (e.keyCode) {
      case this.props.keyCode.left:
        this.judgeCanMoveAndGridStage([-1, 0])
        break;
      case this.props.keyCode.right:
        this.judgeCanMoveAndGridStage([1, 0])
        break;
      case this.props.keyCode.down:
        this.drop()
        break;
      case this.props.keyCode.rotate:
        this.rotate()
        break;
      case this.props.keyCode.pastDown:
        break;
    }
  }

  canSettle (positions: [number, number][]) {
    for (let pos of positions) {
      if (
        pos[0] > this.state.stage.length - 1 ||
        pos[0] < 0 ||
        pos[1] > this.state.stage[0].length - 1 ||
        pos[1] < 0 ||
        this.state.stage[pos[0]][pos[1]].settle
      ) return false
    }

    return true
  }
  blockSettle (): void {
    const userBlockSettleStage = this.getStageConcatBlock(this.state.userBlock.pos, this.state.userBlock.background, true)

    /*
      check stage by userBlock of y position [start]
    */
    const breakRowsStage = [...userBlockSettleStage]

    // step 1: get userBlock y pos list object
    // toCheckYPosList key is yPos and value is fill number as initialized zero
    const toCheckYPosList: { [yPos: number]: number } = {}
    for (let yIndex = 0; yIndex < this.state.userBlock.shape[0].length; yIndex++) {
      toCheckYPosList[this.state.userBlock.standardPos[1] + yIndex] = 0
    }

    // step 2: check stage y pos and toCheckYPosList value plus
    let breakCloumnNum = 0
    for (let xPos = 0; xPos < userBlockSettleStage.length; xPos++) {
      const row = userBlockSettleStage[xPos]

      for (const yPos in toCheckYPosList) {
        if (row[parseInt(yPos)].settle) toCheckYPosList[yPos]++
      }
    }

    // if toCheckYPosList value === stage row, splice and reset
    for (const yPos in toCheckYPosList) {
      if (toCheckYPosList[yPos] === userBlockSettleStage.length) {
        breakCloumnNum++

        for (let x = 0; x < breakRowsStage.length; x++) {
          breakRowsStage[x].splice(parseInt(yPos), 1)
          breakRowsStage[x] = [{ background: '', settle: false }, ...breakRowsStage[x]]
        }
      }
    }

    // call breakBlock event for parent component
    if (breakCloumnNum) this.props.breakRowsEvent(breakCloumnNum)
    /*
      check stage by userBlock of y position [end]
    */


    /*
      set new userBlock [start]
    */
    let newPredictionBlocks = [...this.state.predictionBlocks, getBlock()]
    const [newUserBlockShape] = newPredictionBlocks.splice(0, 1)

    const standardPos: [number, number] = [
      Math.floor((this.state.stage.length - newUserBlockShape.shape.length) / 2),
      0
    ]
    const newUserBlock: ModelUserBlockStage = {
      ...newUserBlockShape,
      standardPos: standardPos,
      pos: this.shapeBlockPosPareser({ ...newUserBlockShape, standardPos })
    }

    // if can't settle gameOver
    if (!this.canSettle(newUserBlock.pos)) {
      this.props.gameOverEvent()
    } else {
      this.setState({
        stage: this.getStageConcatBlock(newUserBlock.pos, newUserBlock.background, false, breakRowsStage),
        userBlock: newUserBlock,
        predictionBlocks: newPredictionBlocks
      })
    }
    /*
      set new userBlock [end]
    */
  }
  judgeCanMoveAndGridStage (mover: [number, number]): boolean {
    const moverBlock = { ...this.state.userBlock }

    moverBlock.standardPos = [moverBlock.standardPos[0] + mover[0], moverBlock.standardPos[1] + mover[1]]
    moverBlock.pos = moverBlock.pos.map(pos => [pos[0] + mover[0], pos[1] + mover[1]])

    if (this.canSettle(moverBlock.pos)) {
      // remove PrevBlockStage
      const stageRemovePrevUserBlock = this.getStageRemoveBlock(this.state.userBlock.pos)

      // set stage by userBlock, settle is false
      this.setState({
        stage: this.getStageConcatBlock(moverBlock.pos, moverBlock.background, false, stageRemovePrevUserBlock),
        userBlock: moverBlock
      })

      return true
    } else {
      return false
    }
  }
  drop () {
    this.eventHandler('removeKey')
    this.eventHandler('removeTimer')
    if (!this.judgeCanMoveAndGridStage([0, 1])) this.blockSettle()
    this.eventHandler('addKey')
    this.eventHandler('addTimer')
  }
  rotate () {
    const shape = [...this.state.userBlock.shape]

    const xYReverse: boolean[][] = []
    shape.forEach((row, xIndex) => {
      row.forEach((yItem, yIndex) => {
        if (!xYReverse[yIndex]) xYReverse[yIndex] = []
        xYReverse[yIndex][xIndex] = yItem
      })
    })

    const rotateShape = xYReverse.reverse()
    let rotatePos = this.shapeBlockPosPareser({ standardPos: this.state.userBlock.standardPos, shape: rotateShape, background: this.state.userBlock.background })


    const doSettle = () => {
      this.setState({
        userBlock: {
          ...this.state.userBlock,
          shape: rotateShape,
          pos: rotatePos
        },
        stage: this.getStageRemoveBlock(this.state.userBlock.pos)
      }, () => {
        this.judgeCanMoveAndGridStage([0, 0])
      })
    }

    if (this.canSettle(rotatePos)) {
      doSettle()
    } else {
      // try left x move
      for (let xMover = 1; xMover <= rotateShape.length; xMover++) {
        rotatePos = rotatePos.map(posItem => [posItem[0] - xMover, posItem[1]])
        
        if (this.canSettle(rotatePos)) {
          doSettle()
          break
        }
      }
    }
  }
  timerEvent () {
    this.drop()
  }

  constructor (props: StageProps) {
    super(props)

    const userBlockPos = this.shapeBlockPosPareser(props.dataUserBlock)
    this.state = {
      stage: this.getStageConcatBlock(userBlockPos, props.dataUserBlock.background, false, props.dataStage),
      userBlock: {
        ...props.dataUserBlock,
        pos: userBlockPos
      },
      predictionBlocks: props.dataPredictionBlocks
    }

    this.keyboardEvent = this.keyboardEvent.bind(this)
    this.timerEvent = this.timerEvent.bind(this)
  }

  componentWillUnmount () {
    this.eventHandler('removeKey')
    this.eventHandler('removeTimer')
  }

  render () { 
    if (this.props.gameStatus === 'play') {
      this.eventHandler('addKey')
      this.eventHandler('addTimer')
    } else {
      this.eventHandler('removeKey')
      this.eventHandler('removeTimer')
    }

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
