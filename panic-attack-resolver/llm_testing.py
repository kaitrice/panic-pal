# from langchain.llms import OpenAI
# from langchain.chat_models import ChatOpenAI

# llm = OpenAI()
# chat_model = ChatOpenAI()

# print(llm.predict("hi!"))

# print(chat_model.predict("hi!"))





# import requests

# def get_chatgpt_response(user_input):
#     api_key = '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'
#     headers = {
#         'Authorization': f'Bearer {api_key}',
#         'Content-Type': 'application/json'
#     }

#     data = {
#         # 'model': 'gpt-3.5-turbo',
#         'prompt': user_input,
#         'temperature': 0.7,
#         'max_tokens': 150
#     }

#     response = requests.post('https://api.openai.com/v1/engines/gpt-3.5-turbo', json=data, headers=headers)
#     if response.status_code != 200:
#         raise Exception(f"Error with status code {response.status_code}, {response.json()}")
#     return response.json()

# def main():
#     user_input = input("Enter your input for ChatGPT: ")
#     response = get_chatgpt_response(user_input)
#     # breakpoint()
#     print(response['choices'][0]['text'])

# if __name__ == "__main__":
#     main()



from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
    {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
  ]
)

print(completion.choices[0].message)