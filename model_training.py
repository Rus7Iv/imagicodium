import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

def train_model(code_text):
    # Загрузка предварительно обученной модели GPT-2
    model = GPT2LMHeadModel.from_pretrained('gpt2')
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')

    # Токенизация текста кода
    input_ids = tokenizer.encode(code_text, return_tensors='pt')

    # Обучение модели
    model.train()
    model.zero_grad()
    output = model(input_ids, labels=input_ids)
    loss = output.loss
    loss.backward()
    model.optimizer.step()

    # Сохранение обученной модели
    model.save_pretrained('my_trained_model')
    tokenizer.save_pretrained('my_trained_model')

    print('Модель успешно обучена!')

if __name__ == '__main__':
    import sys
    code_text = sys.argv[1]
    train_model(code_text)
