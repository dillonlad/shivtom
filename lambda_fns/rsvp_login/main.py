import json
import boto3
import os
from botocore.exceptions import ClientError

# Initialize AWS Services
# Ensure your Lambda has 'dynamodb:GetItem' permissions for this table
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')
TABLE_NAME = os.environ.get('AUTH_TABLE_NAME')

def lambda_handler(event, context):
    try:
        # 1. Parse the incoming password
        # Supporting both direct invocation and API Gateway proxy bodies
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
            
        provided_password = body.get('password')
        print(provided_password)

        if not provided_password:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Password field is required'})
            }

        # 2. Query DynamoDB
        table = dynamodb.Table(TABLE_NAME)
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('password').eq(provided_password)
        )
        print(response)
        # 3. Check if the item exists
        if 'Items' not in response or len(response['Items']) == 0:
            print("Password not found")
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Invalid access code'})
            }
        
        login_item = response['Items'][0]
        print(login_item)

        # 4. Return the stringified JSON stored in the 'events' attribute
        access_data = login_item.get('events', '{}')
        print(access_data, type(access_data), json.loads(access_data))

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': access_data # Returning the stringified JSON directly
        }

    except ClientError as e:
        print(f"AWS Error: {e.response['Error']['Message']}")
        return {'statusCode': 500, 'body': json.dumps({'error': 'Database connection error'})}
    except Exception as e:
        print(f"General Error: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps({'error': 'Internal Server Error'})}