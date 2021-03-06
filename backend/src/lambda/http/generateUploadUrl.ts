import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
import { createAttachmentPresignedUrl } from '../../helpers/todos'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Generate an upload Url event: ', event.pathParameters.todoId)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const url = await createAttachmentPresignedUrl(userId, todoId)

    // TODO[DONE]: Return a presigned URL to upload a file for a TODO item with the provided id
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
