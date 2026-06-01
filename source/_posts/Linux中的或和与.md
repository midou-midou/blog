---
title: Linux中的||和&&
tags:
  - Linux
  - Linux中的命令
url: 679.html
id: 679
categories:
  - 学习呦
date: 2020-06-25 01:10:27
---

## 如果在shell中执行这样的命令输出是什么呢？

假设下面命令中的两个文件都存在

    root@ali_server:~# cat file1||cat file2   

答案：
<style>
  .heimu{ background-color: #252525; color: #252525; text-shadow: none; } .heimu:hover{ transition: color .13s linear; color: #fff; }
</style>
<div class="heimu">会输出file1的内容</div> 
<br />

为什么会这样呢？“||”的意思不是或者吗，没错，但是**在Linux中是先执行||前面的命令也就是例子中的cat file1如果执行失败会执行后面的cat file2**，并且都要先执行第一个命令，无论成功或者失败


cat a成功后就执行第一个cat a  
a1不存在，但是也会执行这个命令，之后执行后面的cat a

同样还是file1和file2，如果执行下面的命令

    root@ali_server:~# cat file1&&cat file2

答案：
<div class="heimu">会输出file1和file2的内容</div> 
<br /> 

“&&”代表并且，也就是“都”的意思，所以就是既cat file1又cat file2