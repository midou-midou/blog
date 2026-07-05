---
title: 树莓派的新（jiu）玩法-个人博客有意思的玩法
tags:
  - CDN加速
  - HTTPS
  - 内网穿透
  - 动静分离
  - 博客
  - 学习
  - 进阶篇
url: 385.html
id: 385
categories:
  - 学习呦
date: 2020-01-30 07:24:16
---

上次我们看过了如何用树莓派搭建wordpress

这一次我们来玩一点不一样的，弄一点树莓派wordpress的进阶的玩法。  

<!-- more -->

1、配置https，让域名前加一个小锁子

2、配置动静分离

3、内网的博客怎么办，内网穿透就行

4、可以用CDN加速博客的访问

**购买一个专属自己的域名，配置https**


我们的网址怎么是一个IP啊

很多个人博客的域名都是通过阿里云等域名服务商进行购买的，有很多的域名可以选择，你像我都小博客就是.cn结尾的博客



因为现在的域名需要备案，所以我这里就不演示域名的购买和备案的过程了。其中ICP备案的流程应该是有2周左右，你需要提交申请书等一系列的操作


有了域名之后就可以使用HTTPS( Hyper Text Transfer Protocol over SecureSocket Layer)协议了

**何为HTTPs**

其实你可以拆开看，为HTTP + SSL/TLS 目的就是加密你的数据，让你上网访问你的博客更安全。

加密数据可以让你的数据安全起来，https采用的加密方式是非对称加密和对称加密，分别用在的整个连接的不同的阶段


https工作流程

这里面涉及到证书的问题，证书是干什么的。浏览器为了确认就是你发送的https请求，而不是别人发送的，也就是说为了防止报文数据的篡改。

通过上面的流程也就知道了我们应该申请一个数字证书，而且在服务器进行配置

如果你是通过域名服务商那里购买的域名，ICP备案完成后就可以直接去域名的仪表板里面下载域名对应的证书，我的是CA机构免费颁发的证书（下面用阿里云来举例子）


免费的证书一年


也可以上传自己的证书

证书都上传完毕了，之后就是在自己的服务器上配置了

**nginx配置https**

https和http的通信的端口是不同的，https是443，http是80


    ssl on;
    ssl_certificate /path/to/你的证书.pem;
    ssl_certificate_key /path/to/你的私钥.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

通过上图的原理图其实很好理解配置的部分，首先要开启ssl，之后就是配置公钥证书，之后配置服务器的私钥用于解密客户端用公钥加密的会话密钥，会话密钥用来加密C和S直接传输的数据

之后的配置ssl\_session\_timeout为会话限制时间、ssl\_ciphers为整个流程中对称加密的算法，ssl\_protocols为支持的传输层安全协议，之后ssl\_prefer\_server_ciphers是依赖SSLv3和TLSv1协议的服务器密码将优先于客户端密码

**apache2配置https**

apache2配置就更简单了，默认会有一个ssl配置的文件，只要填好证书和密钥的位置就可以了

前提是要安装好apache的php模块

![apache2 php模块](/image/img/20200128130756.png)

如果用nginx处理全部的https请求就不用配置apache2了，否则会起端口冲突

配置好之后就是测试下吧


可以看到浏览器的地址栏如果有锁子的标识就证明连接安全哦

![HTTPS安全锁标识](/image/img/20200127230159.png)

**配置动静分离**

还记得上次我们通过f12的开发者工具看到的资源和整个博客都是来自nginx的吗

![nginx处理的资源请求](/image/img/20200127232959.png)

看，又给你看一遍

我们先来了解下nginx和apache分别适合处理什么文件，什么应用场景

nginx：既可以在内部直接支持 Rails 和 PHP 程序对外进行服务，也可以支持作为 HTTP[代理服务](https://baike.baidu.com/item/%E4%BB%A3%E7%90%86%E6%9C%8D%E5%8A%A1)对外进行服务。Nginx采用C进行编写，不论是系统资源开销还是CPU使用效率都比 Perlbal 要好很多。处理静态文件，索引文件以及自动索引，打开文件描述符缓冲。无缓存的反向代理加速，简单的负载均衡和容错。FastCGI，简单的负载均衡和容错。 （[来自度娘](https://baike.baidu.com/item/nginx/3817705?fr=aladdin)）

apache： 超稳定， 对PHP支持比较简单， 处理动态请求有优势，nginx在这方面是鸡肋，一般动态请求要apache去做，nginx适合静态和反向。（[来自CSDN](https://blog.csdn.net/lilygg/article/details/87873964)）

简单的了解了下之后就明白了我们为什么要动静分离了

具体思路：nginx服务器处理前端的请求，如果是请求的静态文件就可以直接处理，但是如果是动态文件就交予后端的apache2服务器。之后apache2直接通过80端口响应

我这里是实现动静分离，不是nginx的负载均衡、反向代理

**注意：是两台服务器，不是一台进行配置**。  
**以下的nginx服务器为192.168.0.115**  
**这里wireless是115，以太网是192.168.0.118**  
**以下的apache2服务器为192.168.0.117**

配置nginx


    location ~* \.(png|jpg|jpeg|gif|bmp|html|swf|ico|rar|zip|txt|doc|ppt|pdf|xls)$ { expires 1d;  }
    location ~ \.(js.css)$ {  expires 1h; }
    location ~ \.php$ {
                    #proxy_set_header Host $host;
                    #proxy_set_header X-Real_IP $remote_addr;
                    #proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_pass http://ip2yourapacheserver:8080;
     }

配置静态文件直接在浏览器缓存中保存的时长，这样就不需要每一次访问博客都请求这些静态的资源文件，因为这些文件是不改变的。

说明下php的配置部分

**remote_addr**  
是nginx与客户端进行TCP连接过程中，获得的客户端真实地址. Remote Address 无法伪造，因为建立 TCP 连接需要三次握手，如果伪造了源 IP，无法建立 TCP 连接，更不会有后面的 HTTP 请求

**X-Real-IP**  
是一个自定义头。X-Real-Ip 通常被 HTTP 代理用来表示与它产生 TCP 连接的设备 IP，这个设备可能是其他代理，也可能是真正的请求端。需要注意的是，X-Real-Ip 目前并不属于任何标准，代理和 Web 应用之间可以约定用任何自定义头来传递这个信息

**X-Forwarded-For**  
X-Forwarded-For 是一个扩展头。HTTP/1.1（RFC 2616）协议并没有对它的定义，它最开始是由 Squid 这个缓存代理软件引入，用来表示 HTTP 请求端真实 IP，现在已经成为事实上的标准，被各大 HTTP 代理、负载均衡等转发服务广泛使用，并被写入 RFC 7239（Forwarded HTTP Extension）标准之中.

（[作者：大富帅 链接：https://www.jianshu.com/p/15f3498a7fad](https://www.jianshu.com/p/15f3498a7fad)）

检查下语法


ok

**配置apache**

这里我用了另一台服务器，用apache2来解析处理php文件

注意，因为我的wordpress都是保存在本地的，所以，我就有了nginx服务器的MySQL和apache2服务器的MySQL，这样就有了两个数据库。但是我们只要一个就好，所以我这里想的是做MySQL的主从复制。apache2的MySQL为主服务器，nginx的为从服务器

但是建议还是用一台云MySQL，这样省事

首先配置监听端口

    sudo vim /path/to/ports.conf


80改成8080就行，别忘了80端口，因为要通过其响应请求

因为是给后端8080端口的apache2，所以apache2要监听8080端口

之后修改virtual server文件

    sudo vim /path/to/apache2/sites-available/000-default.conf


上面的监听端口和下面的文件目录都要改了

之后测试我遇到了一个问题


直接返回php文件了，注意这个的nginx服务器的IP和apache的IP都不是最终的

这是怎么回事呢，原来apache2安装完之后是不带php的模块了

apt检查下下载的模块


**我的php是7.2所以也要下载7.2的模块哦，千万别错了**

之后我们访问nginx服务器192.168.0.115，当然，访问apache服务器也是可以的。


访问nginx是301重定向

我们先看看动态文件


可以看到处理请求的服务器是apache2

我们再来看看静态文件


服务器是nginx文件类型是css


测试下安装一个主题，我的apache服务器是wireless，导致一直有Too many requests的错误  
好不容易才安装好了一个主题

结果换完主题是空白一片，这个主题的css等就没加载出来，我最后还是换一个已经安装的别的主题了


可以看到没什么问题

到这里动静分离的部分就完成啦，通过ab测试下和前面单nginx对比下

    ab -n 1000 http://your_server_ip/path/to/your.file

**实现动静分离后的RPS**

![动静分离后的RPS](/image/img/20200130125141.png)

是17.30

**没有实现动静分离的RPS**

![未实现动静分离的RPS](/image/img/20200130125209.png)

呦，有点差

通过上面的测试也可以看到动静分离，让软件干擅长的事情是多么的重要了吧

**内网穿透这点事**

内网穿透的部分

首先来说一下内网穿透，NAT穿透。NAT网络地址转换，简单大体来讲就是将一个公网的IP对应（映射）一个内网的IP

内网穿透的种类也有很多，最常用的就是端口映射NAPT。将公网IP的一个端口对应内网的一个IP

内网穿透的工具很多，花生壳，向日癸，ngrok第一代，和frp等

ngrok第一代是开源的，第二代作者商用就闭源了。frp和ngrok差不多，如果是个人的网站使用谁都可以。如果访问量大则建议frp


几款穿透工具对比

ngrok的原理简单来讲是反向代理，ngrok服务器和后端请求的服务器透明之后和客户端建立一个隧道


很明确的一张原理图

还有一个好处就是可以让后端的服务器对于客户端不可见，客户端见到的只是ngrok服务器

ngrok如果要自己搭建ngrok服务器就需要一台公网的服务器，但是大家大多数都没有（要不然要什么内网穿透建站呢，直接在公网服务器上搭建不就行了！）

这里我推荐一个[小米球](http://ngrok.ciqiuwl.cn/)

里面有详细的下载ngrok客户端的步骤，以及如何使用的详细步骤

**Ngrok1.7：**

这里推荐国内的[小米球Ngrok服务](https://manager.xiaomiqiu.com/)，是国人搭建的


右下角下载响应的客户端

下载好之后上传到树莓派

这里我的站点的URL填写的是frp.xiaoblogs.cn，但是没有设置这个域名的解析，导致站点的资源文件后台登录都用不了了。这里我用的是一个简单的方法。

首先在树莓派的/etc/hosts文件里面添加一个记录，让我的这个域名指向本机

之后重启网卡或者reboot使生效

之后ping一下域名看是不是解析到本机了


嗯~ o(*￣▽￣*)o

之后就可以进入wordpress的控制面板更改URL了


URL就改成映射的ngrok服务器给你提供的url吧

对了，我们还没讲配置ngork呢


ngrok照frp的配置要简单多了，可能也是我前面的时候一直用的是ngrok

auth_token是在注册系统中给你的，在小米球Ngrok管理系统中能找到

tunnels能里面的所有隧道都可以自己指定名称eg.httptun

远程端口remote_port不要更改，Proto里面的本地端口改成自己的http服务端口

subdomain子域名自己随机设定，别设定成和别人一样的就行

配置好就启动吧

首先先启动ngork吧，看一看给你分配的url

    sudo ./ngrok -config ./ngrok.conf start httptun


通过pi.ngrok2.xiaomiqiu.cn访问本地的80服务

之后就可以更改wordpress的站点URL了

之后就试一试通过这个域名访问吧


后台返回200了


可以看到已经成功的实现内网穿透了

[frp官网](https://diannaobos.com/frp/)

如果你有nas是freeBSD也可以用frp内网穿透，有freeBSD的版本

这里我说明下，因为要付费才能用别人的公网的frps服务器来提供服务，我就用自己的阿里云了

**公网服务器（如果你没有公网服务器就使用别人的，这一步就可以忽略了）:**

公网服务器要用到两个文件，frps.ini和frps的sh文件，一个是frps的配置文件，一个是启动脚本

首先来配置下，因为我要实现的是80端口的穿透


官方的完整配置文件里有详细的说明（这里只是一部分）


设置建立隧道的端口8085，让服务器监听80端口，映射本地的nginx服务器的80端口

别忘记了要在防火墙设置中开放两个端口


阿里云的控制台设置的

之后启动，可以用nohup &做后台启动

    /path/to/frps -c /path/to/frps.ini


成功开启

![frps成功开启](/image/img/frp-success.png)

成功开启

![frps成功开启](/image/img/frpsuccess_LI.jpg)

**本地apache服务器的frpc设置**：


common部分填写公网服务器IP和远程的端口，用来建立隧道，以及验证的token  
下面部分填写本地的IP和端口和远程用于映射的端口

之后启动客户端

    /path/to/frpc -c /path/to/frpc.ini

无论是客户端还是服务端都可以添加日志


可以看到log里面说明登录服务器成功


服务端已经看到了有一个客户端和自己建立了一个连接

之后就是测试了

访问我们自定义的域名，**别忘记了域名要备案并且要到DNS服务器添加A记录或者CNAME记录**


成功的访问到了我们的内网的博客


资源文件也可访问到

这里给大家说一个tips

在安装wordpress要你填写主站IP

那个IP就是wordpress所有资源请求的入口

我碰到了什么问题呢，内网穿透完。可以通过自定义域名访问到主站的index.php但是却访问不到资源文件，而且设计到的提交表单等服务也不行

问题就在wordpress设置里主站IP的设置


**设置在这里，如果你是内网穿透的话，要把这里改成你的代理服务器IP或者自定义的域名**


frp后台可以看到建立了一个连接

当然也可以使用frp提供的dashboard仪表板查看自己的代理


基本上想看的内容都有

基本的内网穿透就完成了，还是很轻松的。

**用CDN加速博客访问**

下面开始最后的1/4之前，要有台公网的服务器和备案的域名。我就用第三方的CDN又拍云来做例子了，用自己的博客来实现加速

首先，又拍云是按流量来收钱的。所以大家用的时候要注意哦

![又拍云CDN价格](/image/img/cdn.png)

价格还好吧

CDN有很多项服务，我使用的仅是域名管理，回源控制，和HTTPS


添加好自己的域名

之后要在DNS解析中添加CNAME


帮助说明的很清楚


添加一个DNS解析


回源管理，设置资源文件站


HTTPS设置

基本的设置在又拍云的官方文档有详细的说明，我就不赘述了

之后就是ab测试环节了

没开启cdn

开启cdn

开启cdn之后提示他的CNAME域名没有备案。。。真实无语了

阿里云也有CDN的服务，文档都超级详细，需要的小伙伴就去跟着步骤走吧。

我这里只是提供一个CDN加速博客的思路

**总结**

这一次的进阶篇完成了4部分的内容，都是对自己的站点进行了优化的工作。当然我这里还有没涉及到的站长必做的SEO。基本到这里，涉及到的知识就很多了，各位同学好友们就多加努力吧，做好一个站长不容易，要长久的学习！才能成为好站长！