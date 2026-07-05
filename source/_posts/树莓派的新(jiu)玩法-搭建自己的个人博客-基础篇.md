---
title: 树莓派的新(jiu)玩法-搭建自己的个人博客-基础篇
tags:
  - wordpress
  - 个人博客
  - 建站
  - 有趣
  - 树莓派
url: 323.html
id: 323
categories:
  - 学习呦
date: 2020-01-15 07:51:31
---

其实这篇博客以前是写过的，不过当时的博客是Ghost，后面因为把树莓派的SD折断了。导致数据都抢救不过来。只能重新搭建自己的博客。

博客的选择有很多，Wordpress、Hexo、Jekyll、Hugo、Ghost、Typecho等等

这些博客各有优缺点，Wordpress功能强大，拓展性好。第三方插件的数量应该是最多的，也有很多的不同主题的网站，你可以将你的网站变成不同类型的网站，不同功能用途的网站。但是因为过多的插件导致wordpress很庞大臃肿，导致浏览器加载速度慢。尤其最近我的博客的一些资源加载要用到wordpress的cdn来加载网站所需的资源文件，有的文件体积庞大，加上时常连接不上。而且wordpress 的数据都是保存在其他数据库中，这其中还要涉及从云数据库或者本地读取数据的过程。导致我的博客的加载速度很慢。（当然，不止这一个原因导致博客慢，只能说是主要的原因）不过可以用国内的cdn做一下动态内容的加速，速度还是挺快的。

Hexo简洁，用的nodejs。从建站到部署只需要几分钟的时间。相较于Wordpress，Hexo不需要数据库的支持，这一点我认为是他快速简洁的最大的原因。通过将MarkDown文件转换成为html文件之后上传到GitHub并且部署到GitHub page或其他仓库。以至于从写文章到发布文章不需要将写好的文章存储到数据库中。多数的个人博客的组合就是Hexo+Github Page

其他的博客我不太熟悉喽，烦请各位自己去查一查原理吧。

简要说了两种博客的优缺点，接下来就是抉择的时候了。  


<!-- more -->

我的树莓派是3B+，通过SD卡的方式存储，非eMMc等现在高级的Linux开发板。待机功耗基本在5W左右，处理1080p视频能力很弱（树莓派的GPU就不是为了处理视频而生，当然，博客不需要太考虑这一点，除非是现在的视频媒体）树莓派3B+支持无线和以太网，多少数据大家看下图吧。

![树莓派3B+规格](/image/img/批注%202020-01-15%20095308.png)



图片[来源](http://tieba.baidu.com/photo/p?kw=%E6%A0%91%E8%8E%93%E6%B4%BE&ie=utf-8&flux=1&tid=6211096781&pic_id=6808e739b6003af350d3bcb33b2ac65c1238b6d7&pn=1&fp=2&see_lz=0)

看到这儿是不是觉得树莓派真的不行？其实，我这里的用途不是针对树莓派的优点所应用的，树莓派有40帧GPIO，而且支持很多OS，Ubuntu，raspberry官方系统，win10IoT等。做很多的物联网设备还是很在行的，自动投食，机械臂，电报机等等。

(⊙﹏⊙)呃……说了这么多的话也是让大家了解下树莓派做博客的一些弊端。各大网站上还有很多的Linux的开发板，自己搜一搜，对比下，有的可以直接装64位Linux也是很不错的。

这次的博客我就用树莓派3B+和wordpress的组合，wordpress简单。等以后的阿里云ECS到期了就转战到Hexo！

**环境准备：**

wordpress是php写的，所以php的环境就必不可少了。

制卡和上电以及配置树莓派WiFi或者网络的步骤烦请大家移步去我的[另一篇博客](https://www.xiaoblogs.cn/?p=185)吧。我的镜像是2019.9月的镜像。


我是无线网卡连接

![无线网卡连接](/image/img/20200117102106.png)

通过shell软件连接到树莓派上（我用的是SecureCRT）

1、首先安装php

可以直接通过apt安装，apt源默认的配置的源什么软件包几乎都有了。所以可以通过

    sudo apt-get update
    sudo apt-get install php7.3 php7.3-fpm php7.3-mysql php7.3-common
    sudo apt-get install default-mysql-server
    sudo apt-get install nginx apache2

php，mysql，nginx就都安装好了。方便快捷，甚至还可以通过下载lnmp一键安装包（[点我去官网](https://lnmp.org/)）

也可以下载源码自己编译

我这里同时安装了nginx和apache，我的想法是nginx做静态文件的处理和调度（如果需要）apache2做动态文件的处理。

根据我的思路，nginx处理外部访问博客的请求，静态文件（图片，css，html等就直接的处理之后返回给客户端，但是动态的文件，php就将请求转发给后面的apache2，通过apache2处理之后返回给客户端）

一点一点来

先配置下nginx的php解析处理


php7.3-fpm已经运行了

打开nginx 的配置文件


位置在这里



配置虚拟服务器server的时候到site-enabled指定的文件夹中去



server块就是nginx里面的虚拟主机，可以配置多个虚拟主机，每一主机都可以处理不同的请求

listen：监听端口


server_name：虚拟主机名，比如你的域名(我的域名：www.xiaoblogs.cn)通过这个名字可以让nginx知道要用你配置的哪个server块来处理

root：就是你配置的虚拟主机的目录

index：访问的主页，可以是html也可以是动态文件php等


location：路径匹配部分。这里说的是匹配到你的服务器的根目录后的路径

php的连接方式用的是通过sock通信，同样也可以通过cgi绑定一个单独的端口通信。

在你配置的虚拟server的根目录建立一个.php的文件，之后填入

    <?php
        phpinfo();
    ?>

**别忘记了，你的php文件以及存放的路径文件夹的权限都要是nginx能访问的www-data**

好了，测试一下吧


可以看到能够正确的访问到index.php并且也表明正确的解析了php文件  
**注意哦，处理的服务器是nginx**

接下来就是数据库了

安装mysql上面已经安装完成了

首先创建一个账户供wordpress使用，通过root用户添加一个用户

但是默认的root密码要更改


通过切换到root用户之后就可以直接登录MySQL了，不需要进入无密码模式

    mysql -u root

之后更改root用户密码，毕竟总是用root用户直接登录MySQL不安全


切换到mysql数据库，这个数据库中存放的是MySQL中的用户名密码权限等数据

    update user set authentication_string=password("你的密码") where user="root";

之后刷新下MySQL系统权限表

    flush privileges;

就OK了

下一步是通过MySQL的root创建一个wordpress的数据库的用户和wordpress数据库，root用户给予这个新用户对wordpress数据库全部权限

    create user wordpress@localhost identified by "你的密码";
    create database 你的wordpress数据库;

命令解释：

CREATE USER '**USERNAME**'@'**HOST**' IDENTIFIED BY '**PASSWORD**';

给予权限

    grant all privileges on 数据库.* to 用户@主机

之后别忘了测试下


可以进入就说明权限设置完毕啦

好了，前置准备就完成了。接下来就是下载wordpress了。

安装wordpress

[官网连接](https://wordpress.org/latest.tar.gz) & [我的私有云盘](http://seafile.xiaoblogs.cn:8000/f/ab50bbc1c7594974bdc8/)（**是5.3版本**）

上传到你的树莓派的/var/www/目录下并解压（建议var这个目录下）

    sudo tar -xvf /path/to/wordpress压缩包.tar.gz


看wordpress目录的所属者和所属组

先设置成nginx的用户所属

    sudo chown -R www-data:www-data wordpress


所有的wordpress文件

首先要配置wordpress数据库，之后直接在浏览器访问安装的php文件就完了

将wp-config-sample.php重新命名成 wp-config.php（建议复制一份留作备份文件）

    备份：sudo cp wp-config-sample.php wp-config-sample.php.backup
    重命名： sudo mv wp-config-sample.php wp-config.php

用文本编辑器打开编辑


这里就是数据库的配置部分

现在的wordpress还可以配置cookie，有兴趣的小伙伴可以试一试

从上到下为数据库名，数据库用户，数据库密码，数据库IP

填写上你的数据库的这些信息就行，肥肠简单啊！

**别着急，别着急，现在还没完**

之后还要回到nginx中配置wordpress呢

在nginx目录下的site-available目录下有一个default文件直接在里面配置wordpress的虚拟server

配置的部分


端口


根目录


资源文件不可直接访问

以及前面配置的php解析部分

之后就是检查下配置文件有无错误之后平滑加载配置文件就行


    sudo nginx -t
    sudo nginx -s reload

之后才到通过浏览器访问直接安装wordpress哦


看到这个是不是超级激动？

访问的域名是 http://example.com/wp-admin/install.php 格式

好了，剩下就是注册用户、设置站点的一些信息了


官方文档的著名的5分钟安装


可以看到就完成了

**总结一下吧**

Wordpress作为最广泛著名的个人CMS，还是有其特点的。安装简单，操作便捷。可拓展性强。有的时候有一个自己的博客写一写技术性的文章或者是心情的随笔都是很不错的地方哎。

下一次我们就要这八经的做HTTPS，动静分离，内网穿透的甚至加入cdn等任务来优化配置我们的博客了呢。