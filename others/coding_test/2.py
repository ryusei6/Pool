def main():
    n = 1000

    sum_3 = sum(range(1, n//3 + 1)) * 3
    sum_5 = sum(range(1, n//5 + 1)) * 5
    sum_15 = sum(range(1, n//15 + 1)) * 15
    print(sum_3 + sum_5 - sum_15)


if __name__ == '__main__':
    main()
