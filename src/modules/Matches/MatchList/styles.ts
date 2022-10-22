import styled from 'styled-components'

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const TimeCell = styled(FlexColumn)`
  text-align: center;
  padding-right: 10px;
  border-right: 1px solid #00000069;
`

export const TimeHeader = styled.th`
  text-align: center;
  width: 100px;
`

export const ScoreWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  & span:not(.winner) {
    opacity: 0.6;
  }
`
export const Teams = styled(FlexColumn)<{ finished: boolean }>`
  & span {
    ${props => !props.finished && `opacity: 1!important;`}
  }
`
export const Score = styled(FlexColumn)``
