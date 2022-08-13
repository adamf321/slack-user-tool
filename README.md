Please use this README file for notes of any design decisions, trade-offs, or improvements you’d make to the project.

Please see the [instructions](INSTRUCTIONS.md) to get started.

Insert: ignore if already exists
Update: retry if does not exist


```
aws lambda invoke \
    --function-name aws-node-project-dev-user-eventWorker \
    --endpoint-url http://localhost:3002 \
    --cli-binary-format raw-in-base64-out \
    --payload '{"Records":[{"body":{"operation":"insert","user":{"id":"U1234567","name":"some-user","deleted":false,"real_name":"SomeUser","tz":"America/Los_Angeles","status_text":"ridingatrain","status_emoji":":mountain_railway:","image_512":"https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=512&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-512.png"}}}]}' \
    /dev/stdout
```

```
curl --location --request POST 'https://kjrs8de4dj.execute-api.us-east-1.amazonaws.com/prod/webhook' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
    "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
    "type": "url_verification"
}'
```

```
curl --location --request POST 'https://kjrs8de4dj.execute-api.us-east-1.amazonaws.com/prod/webhook' \
--header 'Content-Type: application/json' \
--data-raw '{
    "cache_ts": 1648596421,
    "type": "user_change",
    "event_ts": "1648596712.000001",
    "user": {
        "id": "U1234567",
        "name": "some-user",
        "deleted": false,
        "real_name": "SomeUser",
        "tz": "America/Los_Angeles",
        "profile": {
            "status_text": "ridingatrain",
            "status_emoji": ":mountain_railway:",
            "image_512": "https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=512&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-512.png"
        }
    }
}'
```


for slack event:
 --payload '{"Records":[{"body":{"operation":"insert","user":{"id":"U1234567","name":"some-user","deleted":false,"real_name":"SomeUser","tz":"America/Los_Angeles","profile":{"status_text":"ridingatrain","status_emoji":":mountain_railway:","image_512":"https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=512&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-512.png"}}}}]}' \
    out.json

- Security:
    - Secreats should not be in the code
    - Authenticate callbacks from Slack
    - Authenticater UI access
    - Better sql injection protection
- Scalability:
    - Aurora
    - UI pagination
    - Initial load script: paginate, currently works up to 200 users
