import json
import boto3
import uuid
import os
from datetime import datetime
from botocore.exceptions import ClientError

# Initialize AWS Services
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')
ses = boto3.client('ses', region_name='eu-west-2') # Update to your region

# Configuration - Best to use Environment Variables in Lambda settings
TABLE_NAME = os.environ.get('TABLE_NAME')
MY_EMAIL = os.environ.get('RECIPIENTS') # Where the notification goes
SENDER_EMAIL = os.environ.get('SENDER') # Must be verified in SES

def lambda_handler(event, context):
    try:
        # 1. Parse Data
        body = event
        full_name = body.get('name', 'Unknown')
        # last_name = body.get('lastName', 'Guest')
        # guests = body.get('guests', 1)
        events = body.get('events', [])
        notes = body.get("notes", None)

        print(body, full_name, body, event)
        
        rsvp_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()

        guest_events = {
            "events": events,
            "notes": notes
        }

        print(TABLE_NAME)
        # 2. Save to DynamoDB
        table = dynamodb.Table(TABLE_NAME)
        table.put_item(Item={
            'full_name': full_name,
            'events ': json.dumps(guest_events),
        })

        # 3. Send Email Notification via SES
        email_subject = f"Wedding RSVP: {full_name}"
        email_body = f"""
        New RSVP Received!
        
        Name: {full_name}
        Time: {timestamp}
        Notes: {notes}
        ID: {rsvp_id}
        """

        ses.send_email(
            Source=SENDER_EMAIL,
            Destination={'ToAddresses': [MY_EMAIL]},
            Message={
                'Subject': {'Data': email_subject},
                'Body': {'Text': {'Data': email_body}}
            }
        )

        # 4. Success Response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'status': 'success', 'message': 'RSVP saved and notification sent!'})
        }

    except ClientError as e:
        print(f"AWS Error: {e.response['Error']['Message']}")
        return {'statusCode': 500, 'body': json.dumps({'error': 'AWS Service Error'})}
    except Exception as e:
        print(f"General Error: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps({'error': 'Internal Server Error'})}