import Joi from 'joi'
import {GenerateTokenRequest, TokenMode} from "../types";

export const GenerateTokenSchema = Joi.object<GenerateTokenRequest>({
  key: Joi.string().required(),
  data: Joi.object().default({}),
  username: Joi.string().email().required(),
  mode: Joi.string().valid('PRESENTER', 'VIEWER', 'GUEST').default(TokenMode.VIEWER)
})