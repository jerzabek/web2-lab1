import Router from 'next/router'
import postJson from '../src/api/post'
import MatchForm from '../src/modules/Matches/MatchForm'
import { FormData } from '../src/modules/Matches/MatchForm/MatchForm'

function Create() {
  const handleSubmit = async (data: FormData) => {
    try {
      await postJson(`/api/match/create`, data)
      
      Router.push('/')
    } catch (e) {
      console.log('err occurred', e)
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-xs-12 col-sm-6">
          <h2>Stvori novu utakmicu</h2>

          <MatchForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Create
