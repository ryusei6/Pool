def main():
    n = int(input())
    S = input()

    words_lower = []
    counter = 0
    word = ''
    for i in range(n):
        word += S[i]
        if S[i].isupper():
            counter += 1
        if counter == 2:
            # print(word)
            words_lower.append(word.lower())
            counter = 0
            word = ''
    words_lower.sort()
    words = []
    for i in range(len(words_lower)):
        word_list = list(words_lower[i])
        word_list[0] = word_list[0].upper()
        word_list[-1] = word_list[-1].upper()
        words.append(''.join(word_list))
    print(''.join(words))


if __name__ == '__main__':
    main()
