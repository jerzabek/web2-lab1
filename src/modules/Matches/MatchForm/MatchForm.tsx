import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'

type TeamOption = {
  label: string
  value: string
}

export interface FormData {
  homeTeam: number
  awayTeam: number
  homeScore?: number
  awayScore?: number
  round: number
  timestamp: number
}

interface Props {
  formValues?: FormData
  onSubmit: (data: FormData) => void
}

function MatchForm({ onSubmit, formValues }: Props) {
  const [teams, setTeams] = useState<TeamOption[]>([])

  const [homeTeam, setHomeTeam] = useState<TeamOption | null>()
  const [awayTeam, setAwayTeam] = useState<TeamOption | null>()
  const [homeScore, setHomeScore] = useState<number | undefined>(formValues?.homeScore)
  const [awayScore, setAwayScore] = useState<number | undefined>(formValues?.awayScore)

  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)

  const [round, setRound] = useState(formValues?.round || 1)

  useEffect(() => {
    fetch('/api/teams')
      .then(data => data.json())
      .then((teamsData: Array<TeamOption>) => {
        // Set default values for team pickers
        if (formValues?.homeTeam !== undefined)
          setHomeTeam(teamsData.find(team => Number(team.value) === formValues.homeTeam))

        if (formValues?.awayTeam !== undefined)
          setAwayTeam(teamsData.find(team => Number(team.value) === formValues.awayTeam))

        // Store teams
        setTeams(teamsData)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!formValues?.timestamp) return

    setDate(moment.unix(formValues.timestamp).format('YYYY-MM-DD'))
    setTime(moment.unix(formValues.timestamp).format('HH:mm'))
  }, [formValues?.timestamp])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      homeTeam: Number(homeTeam?.value),
      awayTeam: Number(awayTeam?.value),
      homeScore,
      awayScore,
      timestamp: moment(`${date} ${time}`).unix(),
      round,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-xs-12 col-sm-6">
          <div className="form-group mb-2">
            <label className="form-label">Home team</label>
            <Select instanceId="homeTeam" options={teams} onChange={setHomeTeam} value={homeTeam} />
          </div>
        </div>
        <div className="col-xs-12 col-sm-6">
          <div className="form-group mb-2">
            <label className="form-label">Away team</label>

            <Select instanceId="awayTeam" options={teams} onChange={setAwayTeam} value={awayTeam} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 col-sm-6">
          <div className="form-group mb-2">
            <label className="form-label">Home score</label>
            <input
              type="number"
              name="homeScore"
              value={homeScore}
              onChange={e => setHomeScore(Number(e.target.value))}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-xs-12 col-sm-6">
          <div className="form-group mb-2">
            <label className="form-label">Away score</label>
            <input
              type="number"
              name="awayScore"
              value={awayScore}
              onChange={e => setAwayScore(Number(e.target.value))}
              className="form-control"
            />
          </div>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-xs-12">
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Match date and time
            </label>
            <input
              type="date"
              name="date"
              value={date || ''}
              onChange={e => setDate(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="time"
              name="time"
              value={time || ''}
              onChange={e => setTime(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-xs-12 col-sm-6 col-md-3">
          <label htmlFor="round" className="form-label">
            Kolo
          </label>
          <input
            type="number"
            name="round"
            className="form-control"
            value={round}
            onChange={e => setRound(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <input type="submit" value="Save" className="btn btn-success" />
        </div>
      </div>
    </form>
  )
}

export default MatchForm
