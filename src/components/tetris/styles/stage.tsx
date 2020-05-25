import styled from 'styled-components'
import { Cell as CellProps } from '../typeModels' 

const cellSize = {
  width: 30,
  height: 30
}

export const Cell = styled.div<CellProps>`
  height: ${cellSize.height}px;
  box-sizing: border-box;
  border-bottom: 1px solid #000;
  background: ${props =>
    props.background === '' ?
    'none' : props.background
  };
  &:last-child {
    border-bottom: none
  };
`

export const Row = styled.div`
  width: ${cellSize.width}px;
  border-right: 1px solid #000;
  box-sizing: border-box;
  float: left;
  &:last-child {
    border-right: none
  };
`
export const Stage = styled.div<{ cellCount: number }>`
  width: ${props => props.cellCount * cellSize.width}px;
  border: 1px solid #000;
  &:after {
    content: '';
    display: block;
    clear: both;
  };
`
