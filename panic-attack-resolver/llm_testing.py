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



# from openai import OpenAI
# import threading
# import time
# import sys

# client = OpenAI()

# messages=[
#     {"role": "system", "content": "You are a cognative behavioral therapist specializing in panic disorde with 20 years of experience. You help people get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack."}
#   ]

# while True:
#     user_input = input("\nUser: ")
#     messages.append({"role": "user", "content": user_input})
#     completion = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=messages
#     )
#     messages.append(completion.choices[0].message)
#     print("\nTherapist:", completion.choices[0].message.content)


from openai import OpenAI
import threading
import time
import sys

client = OpenAI()

messages=[
    {"role": "system", "content": "You are a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. You help people get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack."}
]

def get_response(user_input, messages, response_container):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    messages.append(completion.choices[0].message)
    response_container['response'] = completion.choices[0].message.content

while True:
    user_input = input("User: ")
    messages.append({"role": "user", "content": user_input})

    # Container for the response
    response_container = {'response': None}

    # Start the API call in a separate thread
    threading.Thread(target=get_response, args=(user_input, messages, response_container)).start()

    # Loading messages
    loading_messages = ["Therapist: .  ", "Therapist: .. ", "Therapist: ..."]
    while response_container['response'] is None:
        for message in loading_messages:
            sys.stdout.write('\r' + message)
            sys.stdout.flush()
            time.sleep(0.5)  # Adjust the speed of rotation here
            if response_container['response'] is not None:
                break

    # Print the final message
    sys.stdout.write('\rTherapist: ' + response_container['response'] + '\n')
