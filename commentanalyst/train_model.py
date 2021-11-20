import pandas as pd
import string
import emoji
import re
from underthesea import word_tokenize
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB, GaussianNB
from sklearn import metrics
import pickle

# Load data
#data_path = "data.csv"
#dataset = pd.read_csv(data_path, sep=',')
data_path = "hotel_previews_data_vietnamese.xlsx"
dataset = pd.read_excel(data_path)

# Drop 2 lastest colum
#dataset.drop(dataset.columns[[2, 3]], axis=1, inplace=True)

# Function to remove extended character
def remove_extended_char(text):
    i = 0
    while i < len(str(text)) - 1:
        if text[i] == text[i+1]:
            text = text[:i] + '' + text[i+1:]
        else:
            i += 1
    return text


# Removed extend character
new_data = []
for comment in dataset['comment']:
    new_data.append(remove_extended_char(comment))
dataset['comment'] = new_data

# Removed punctuation
new_data = []
for comment in dataset['comment']:
    for c in string.punctuation:
        comment = comment.replace(c, "")
    new_data.append(comment)
dataset['comment'] = new_data

# Removed emoji and lowercase characters
new_data = []
for comment in dataset['comment']:
    text = emoji.demojize(comment)
    emojis = re.findall(r'(:[!_\-\w]+:)', text)
    text = ' '.join([char.lower() for char in text.split()
                    if not any(i in char for i in emojis)])
    new_data.append(text)
dataset['comment'] = new_data

# Removed Vietnamese Stopword
f = open('vietnamese_stopword.txt', encoding="utf8")
stop_word = []
for row in f:
    row = row.replace("\n", "")
    stop_word.append(row)
f.close()

new_data = []
for comment in dataset['comment']:
    token = word_tokenize(comment)
    remove_stop_words = [word for word in token if word not in stop_word]
    result = ' '.join(remove_stop_words)
    new_data.append(result)
dataset['comment'] = new_data

# Create one hot vector
cv = CountVectorizer(ngram_range=(1, 1), tokenizer=word_tokenize)
text_counts = cv.fit_transform(dataset['comment'])

# Split dataset
X_train, X_test, Y_train, Y_test = train_test_split(
    text_counts, dataset['label'], test_size=0.2, random_state=5)

# Train model
MNB = MultinomialNB()
MNB.fit(X_train, Y_train)

# Evaluate model
predicted = MNB.predict(X_test)
accuracy_score = metrics.accuracy_score(predicted, Y_test)
print(str('{:04.2f}'.format(accuracy_score*100))+'%')

# save model and countvector
pickle.dump(MNB, open("model.pickle", "wb"))
pickle.dump(cv, open("countvector.pickle", "wb"))
