import React from 'react'
import { ModelScoreBoard } from './typeModels'

const ScoreBoard: React.SFC<ModelScoreBoard> = (props: ModelScoreBoard) => {
  return (
    <div>
      <h3>score: {props.score}</h3>
      <h3>level: {props.level}</h3>
      <h3>rows: {props.rows}</h3>
    </div>
  )
}

export default React.memo(ScoreBoard)
