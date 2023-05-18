import { SurveyModel } from '../models/survey-model'

export interface LoadSurveyList {
  loadAll: () => Promise<SurveyModel[]>
}
