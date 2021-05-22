def main():
    a, b = map(int, input().split())

    result = a * b
    if result >= 10000:
        print('NG')
    else:
        print(result)


if __name__ == '__main__':
    main()
