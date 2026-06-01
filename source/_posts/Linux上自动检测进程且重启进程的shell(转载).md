---
title: Linux上自动检测进程且重启进程的shell(转载)
tags:
  - Linux
  - shell
  - 自动化
url: 495.html
id: 495
categories:
  - 学习呦
date: 2020-02-03 08:41:16
---

原文链接： [https://www.jb51.net/article/43961.htm](https://www.jb51.net/article/43961.htm)

前几天服务器有一个长期运行的进程，提供服务。但是总是遇到进程被kill的情况。总是有小伙伴给我抱怨，**我的思路就是用ps命令通过管道给grep之后通过字符串的处理提取出进程号，或者进程的名字。判断如果不存在就通过nohup &重启这个进程。但也想看一看还有什么别的办法。**所以闲来搜索下有关的shell，也想看一看别人的思路。拓宽思路  

第一种：  
<!-- more -->

    #!/bin/sh
    program=XXXX     #进程名
    sn=`ps -ef | grep $program | grep -v grep |awk '{print $2}'`  #获得进程端口号
    if [ "${sn}" = "" ]    #如果为空,表示进程未启动
    then
    nohup /home/oracle/XXXX  &    #后台启动进程
    echo start ok !
    else
    echo running
    fi

这个shell就是我的思路，第三行可以通过层层管道拿到进程的pnumber。通过ps命令+参数列出进程信息，之后通过grep得到进程名匹配的那一行之后去掉grep进程的一行，因为grep命令使用的时候也是进程，如果输入进程名就会有两个匹配的结果。之后通过awk工具得到匹配行的第二个参数（也就是进程号了）

第二种：

    #!/bin/sh
    ps -ef |grep ./FileServer > /dev/null 2>&1  #检测进程写入/dev/null
    if [ $? -eq 0 ]  #0为正常
    then
    echo logprocess run ok!
    else
    nohup /path/to/XXXX &
    echo start ok !
    fi

这种写法涉及到标准输入输出，2是标准错误输出，1是标准输出。/dev/null是一个黑洞，这条命令也就是标准输出和错误都给这个“黑洞”，屏幕不会有任何的显示。并且如果有这个进程也就说这一条命令的执行结果为0，也就是执行成功了。

第三种：

    #!/bin/sh
    count=`ps -fe |grep "a.out" | grep -v "grep" | wc -l`
    if [ $count -lt 1 ]; then
    /path/to/xxxx.sh

这个shell看着好简洁，基本的情况和第一种有一部分是相同的。只是后面的部分不同，是统计行数的。如果小于1就说明没有这个进程了，很好理解吧！

第四种：

    #! /bin/bash
    echo "请输入进程名:"
    read process
    echo "你要查找的进程是 $process ,正在查找..."
    ps > text1
    grep "$process" text1
    declare -i a=$?
    if [ $a -eq 0 ]
    then
    echo "该进程存在"
    else
    echo "该进程不存在"
    fi
    rm text1

declare -i

是将后面的参数声明为整数型

这个sh就不解释啦，不过这个也是唯一一个要求有标准输入的shell，不是太满足我们的自动化的要求

第五种：

    PNAME="xxxx"
    PATHNAME=/path/to/
    LENGTH=`ps -ef|grep "$PNAME"|grep -v grep|cut -b 49-200|wc -c `
    if test $LENGTH -eq 0
    then
    cd $PATHNAME
    nohup $PNAME >/dev/null

这个是最有意思的一个shell了，它前面和第一种第三种一样的，但是到了后面cut这里就是统计前面的匹配行从位置49-200的字符之后统计大小为多少byte，如果是0就说明没有这个进程嘛，因为没有匹配的行也就不可能统计出那些字占的大小啦，这是我认为思路最有趣的一个shell了。

看了这么多的shell，有没有新的想法？快在下面交流吧