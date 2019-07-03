# -- coding: utf-8 --
###########################################
# rowkey：随机的两位数 + 当前时间戳，并要确保该rowkey在表数据中唯一。
# 列定义：name、age、sex、edu、tel、email、country。
# 0001,tom,17,man,,176xxxxxxxx,,China
# 0002,mary,23,woman,college,,cdsvo@163.com,Japan
# 0003,sam,18,man,middle,132xxxxxxxx,,America
# 0004,Sariel,26,,college,178xxxxxxxx,12345@126.com,China
###########################################
import random
import string
import sys

# 大小写字母
alphabet_upper_list = string.ascii_uppercase
alphabet_lower_list = string.ascii_lowercase


# 随机生成指定位数的字符串
def get_random(instr, length):
    # 从指定序列中随机获取指定长度的片段并组成数组，例如:['a', 't', 'f', 'v', 'y']
    res = random.sample(instr, length)
    # 将数组内的元素组成字符串
    result = ''.join(res)
    return result



# 创建名字
def get_random_name(length):
    name = string.capwords(get_random(alphabet_lower_list, length))
    return name


# 获取年龄
def get_random_age():
    return str(random.randint(18, 60))


# 获取性别
def get_random_sex():
    return random.choice(["woman", "man"])


# 获取学历
def get_random_edu():
    edu_list = ["primary", "middle", "college", "master", "court academician"]
    return random.choice(edu_list)


# 获取电话号码
def get_random_tel():
    pre_list = ["130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "147", "150",
                "151", "152", "153", "155", "156", "157", "158", "159", "186", "187", "188"]
    return random.choice(pre_list) + ''.join(random.sample('0123456789', 8))


# 获取邮箱名
def get_random_email(length):
    alphabet_list = alphabet_lower_list + alphabet_upper_list
    email_list = ["163.com", "126.com", "qq.com", "gmail.com"]
    return get_random(alphabet_list, length) + "@" + random.choice(email_list)


# 获取国籍
def get_random_country():
    country_list = ["Afghanistan", "Anguilla", "Australie", "Barbados", "China", "Brisil", "Colombie", "France",
                    "Irlande", "Russie", "Suisse", "America", "Zaire", "Vanuatu", "Turquie", "Togo", "Suisse",
                    "Sri Lanka", "Porto Rico", "Pirou"]
    return random.choice(country_list)


# 放置生成的并且不存在的rowkey
rowkey_tmp_list = []


# 制作rowkey
def get_random_rowkey():
    import time
    pre_rowkey = ""
    while True:
        # 获取00~99的两位数字，包含00与99
        num = random.randint(00, 99)
        # 获取当前10位的时间戳
        timestamp = int(time.time())
        # str(num).zfill(2)为字符串不满足2位，自动将该字符串补0
        pre_rowkey = str(num).zfill(2) + str(timestamp)
        if pre_rowkey not in rowkey_tmp_list:
            rowkey_tmp_list.append(pre_rowkey)
            break
    return pre_rowkey


# 生成一条数据
def get_random_record():
    return get_random_rowkey() + "," + get_random_name(
        5) + "," + get_random_age() + "," + get_random_sex() + "," + get_random_edu() + "," + get_random_tel() + "," + get_random_email(
        10) + "," + get_random_country()


# 将记录写到文本中
def write_record_to_file():
    # 覆盖文件内容，重新写入
    f = open(sys.argv[1], 'w')
    i = 0
    while i < int(sys.argv[2]):
        record = get_random_record()
        f.write(record)
        # 换行写入
        f.write('\n')
        i += 1
        print("完成{0}条数据存储".format(i))
    f.close()


if __name__ == "__main__":
    write_record_to_file()