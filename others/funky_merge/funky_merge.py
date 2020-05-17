def interleave(l):
    max_len = max(map(len, l))
    formed_list = []
    interleaved_list = []
    for i in range(len(l)):
        diff_len = max_len - len(l[i])
        formed_list.append(l[i] + [None]*diff_len)
    for i in range(max_len):
        for j in range(len(formed_list)):
            interleaved_list.append(formed_list[j][i])
    none_num = interleaved_list.count(None)
    for i in range(none_num):
        interleaved_list.remove(None)
    return interleaved_list

def funky_merge(*objs):
    objs = list(objs)[:]
    out_obj = {}
    used_key = []
    all_key = set()
    for obj in objs:
        for key in obj.keys():
            all_key = all_key | set(key)
    for key in all_key:
        all_list = []
        all_obj = []
        value_type = ''
        for j in range(len(objs)):
            value = objs[j].get(key)
            value_type = type(value)
            if not value:
                continue
            if value_type is int:
                out_obj[key] = value
            if value_type is list:
                all_list.append(value)
            if value_type is dict:
                all_obj.append(value)
        if value_type is list:
            interleaved_list = interleave(all_list)
            out_obj[key] = interleaved_list
        if value_type is dict:
            out_obj[key] = funky_merge(*all_obj)
    return out_obj

def main():
    obj1 = {"a":1,"b":{"c":2,"d":[2,0],"e":4}}
    obj2 = {"a":2,"b":{"c":1,"d":[1,2,3],"f":5}}
    obj3 = {"b":{"d":[4]}}
    data = [obj1,obj2,obj3]

    result = funky_merge(*data)
    print(result)


if __name__ == '__main__':
    main()
