---
title: HUAWEI Atlas200学习日志（一）Mind Studio开发环境的搭建
tags:
  - AI
  - 开发
url: 54.html
id: 54
categories:
  - 学习呦
date: 2019-06-02 11:50:13
---

华为Atlas开发者套件 Atlas 200 Developer Kit（缩写：Atlas 200 DK ）是以海思Ascend 310芯片为核心的一个开发者板形态产品，主要功能是将Ascend 310芯片的核心功能通过该板上的外围接口开放出来，方便用户快速简捷的接入并使用Ascend 310芯片强大的处理能力。

Atlas DK配备一个核心系统模块Atlas 200模块，通过高速连接器将Ascend 310的主要业务接口通过底板扩展出来。

可以运用于平安城市、无人机、机器人、视频服务器、闸机等众多领域。---_[来自官网简介](https://www.huawei.com/minisite/ascend/cn/about.html)

**开发环境搭建：**  

<!-- more -->


官方文档的AI开发流程的一部分

开发环境是基于Ubuntu16.04的，所以要干什么应该很清楚（必须是16.04）

不需要clone整个仓库，只需要其中一个版本的工具就行


下载的工具是B750SP05

之后就是在Ubuntu下安装Mine Studio

安装可以通过_[官方的文档](https://www.huawei.com/minisite/ascend/pdf/03%20Ascend%20310%20Mind%20Studio%20%E5%AE%89%E8%A3%85.pdf)_，官方提供了两种安装的方式。引导式安装和手动安装，我用的是引导式安装


按照引导的流程走


可以看到安装就成功了，直接在浏览器里面IP:Port来访问


Mine Studio还有profile没截图

**然后是Atlas200和Mine Studio的连接**

_[官方的文档](https://www.huawei.com/minisite/ascend/pdf/04%20Ascend%20310%20Atlas%20200%20DK%20%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97.pdf)_提供了两种连接的方式（网线和usb）

我采用的是usb的方式连接Atlas200


_USB_ Type-_C_ （type-c接口连接到电脑）


这是连接好后的usb网卡


这个是usb网卡的配置

之后是制作UI Host交叉编译环境（如果用了制卡工具直接通过搭建的环境制作了Atlas的系统就不用后面这一步了）

从官方的tools仓库下载交叉编译环境的python文件

安装完成后就是在Mine Studio中添加Atlas200


通过usb进行通讯

后续还可以配置openpgp公钥和完成验证软件的完整性工作。

**总结**：官方的文档非常的详细，虽然整个社区不大，资源不多。但是华为的官方资料感觉就能够完成基础的操作。