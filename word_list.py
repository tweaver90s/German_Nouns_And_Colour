import pandas as pd
import openai
import PIL
from PIL import Image
import requests
from io import BytesIO
import time
import numpy as np
import os

def word_list_processing():
    word_list = pd.read_csv('../Assets/Data/German_2000_Nouns.txt', sep = '\t', header = 3, names = ['German', 'English', 'unsure'])
    word_list['German'] = word_list['German'].apply(lambda x : x.split(' ~ '))
    word_list['Singular'] = word_list['German'].apply(lambda x: x[0])
    word_list['Plural'] = word_list['German'].apply(lambda x: x[1])

    word_list['Singular split'] = word_list['Singular'].apply(lambda x : x.split(' '))
    word_list['Article'] = word_list['Singular split'].apply(lambda x: x[0])
    word_list = word_list[(word_list['Article'] == 'Der') | (word_list['Article'] == 'Die') | (word_list['Article'] == 'Das')]
    word_list['Singular'] = word_list['Singular split'].apply(lambda x: x[1])

    word_list = word_list[['Article', 'Singular', 'Plural', 'English']]

    word_list.to_csv('test.csv', index = False, encoding='utf-8-sig')

def get_images(word):
    print(word)
    client = openai.OpenAI()

    try:
        response = client.images.generate(
        model="dall-e-2",
        prompt="Create a simple line drawing depicting " + word +" that only uses the colour black. The image should clearly depict the noun in a simple and easily recognizable manner. The images should be suitable for use in a game where players need to quickly identify the depicted object.",
        size="1024x1024",
        quality="standard",
        n=1,
        )
    except Exception as e:
        print(e)
        time.sleep(30)
        get_images(word)

    image_url = response.data[0].url
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
    img.save("Assets/Images/" + word + "_bw.png") 


# Everything has been downloaded up until Security, 339
#all_words = pd.read_csv('Assets/Data/word_list.csv')
#for i in np.linspace(233, 399, 167):
    #get_images(all_words['English'][i])


def process_image(image_path):
    # Open the image
    img = Image.open(image_path)
    
    # Convert image to RGBA to support transparency
    img = img.convert("RGBA")
    
    # Define a function to check if a pixel is white
    def is_white(color, threshold=200):
        # Check if all RGB values are close to 255 (white)
        return all(c >= threshold for c in color[:3])
    
    # Process each pixel
    width, height = img.size
    for x in range(width):
        for y in range(height):
            pixel = img.getpixel((x, y))
            if is_white(pixel):
                # Set alpha channel to 0 for white pixels
                img.putpixel((x, y), (255, 255, 255, 0))
    
    # Save the processed image
    img.save(image_path)


all_images = [f for f in os.listdir("Assets/Images/") if os.path.isfile(os.path.join("Assets/Images/", f))]
for i, file in enumerate(all_images):
    print(i, file)
    process_image("Assets/Images/" + file)