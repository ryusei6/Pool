def main():
    n = 10

    if n == 1:
        print(0)
        return
    if n == 2:
        print(2)
        return
    a = 1
    b = 2
    ans = 2
    for _ in range(n-2):
        c = a + b
        if c % 2 == 0:
            ans += c
        a = b
        b = c
    print(ans)


if __name__ == '__main__':
    main()
