import { ModelBlock } from '../typeModels'

const blocks: ModelBlock[] = [
  // ㄱ
  {
    shape: [
      [true, true, true],
      [true, false, false]
    ],
    background: '#186BD6'
  },
  {
    shape: [
      [true, false, false],
      [true, true, true]
    ],
    background: '#DE651B'
  },
  // ㄱ + ㄴ
  {
    shape: [
      [false, true],
      [true, true],
      [true, false]
    ],
    background: '#ED5056'
  },
  {
    shape: [
      [true, false],
      [true, true],
      [false, true]
    ],
    background: '#4ABA54'
  },
  // ㅡ
  {
    shape: [
      [true, true, true, true]
    ],
    background: '#68C5DB'
  },
  // ㅗ
  {
    shape: [
      [true, false],
      [true, true],
      [true, false]
    ],
    background: '#C57CEA'
  },
  // ㅁ
  {
    shape: [
      [true, true],
      [true, true]
    ],
    background: '#F6C643'
  }
]

const getBlock = (): ModelBlock => {
  return blocks[Math.floor(Math.random() * blocks.length)]
}

export default getBlock
