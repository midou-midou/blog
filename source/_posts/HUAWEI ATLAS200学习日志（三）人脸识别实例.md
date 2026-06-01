---
title: HUAWEI ATLAS200学习日志（三）人脸识别实例
tags:
  - AI
  - 嵌入式
url: 115.html
id: 115
categories:
  - 学习呦
date: 2019-06-11 03:57:28
---

这次的实验是使用开发板运行官方提供的实例程序（人脸识别程序）  

<!-- more -->

**准备工作：**

从官方的仓库下下载好实例程序代码

之后将实例的代码上传到Ubuntu服务器（也就是开发环境）


已经下载好了，可以见到有部署脚本，运行程序停止程序脚本

之后要配置两个环境变量（DDK\_HOME和 LD\_LIBRARY\_PATH）这两个环境变量就是Mind Studio的环境变量，类同JDK、JAVA\_HOME

    export DDK_HOME=/home/[安装Mind Studio的用户名]/tools/che/ddk/ddk
    export LD_LIBRARY_PATH=$DDK_HOME/uihost/lib


配置的环境变量，之后用.命令生效环境变量

**部署：**

在实例程序的根目录下运行部署脚本（这个脚本会执行三个动作：1、编译和部署Ascenddk公共库，2、下载网络模块，3、配置主机服务器）

这里有一个小细节，用sh命令默认不是bash解释器执行sh脚本，所以会出现错误，这里要用bash解释器（Linux是多shell嘛，这里用bash这个shell）

    bash deploy.sh x.x.x.x[默认的开发板IP] internet


上面提到的小细节

部署脚本后有两个参数（host\_ip：开发板IP，load\_mode：就是加载模块的方式是本地还是从网络直接下载，如果从本地加载要提前下载好模块放到实例的script文件夹下）


运行部署脚本有一个步骤是选择演示IP，我选的是mind Studio同一个IP

部署成功后开启演示服务器

    python3 presenterserver/presenter_server.py --app face_detection &


可以通过-h查看如何实验这个命令  


可以在7007端口查看演示服务器上的实例


什么实例都没有

**运行实例程序：**

先安装摄像头


拆盖子的时候小心，树莓派的摄像头一定要断电连接  



可以看到正在运行的实例程序

运行程序

    bash run_facedetectionapp.sh x.x.x.x[开发板默认IP] video/image Channel-1/Channel-2 &


可以看到step那个info


人脸检测

PS：这个人脸检测的实例最大支持10个通道同时检测，视频的最高帧率为20fps，当网络带宽很窄时，会自动的降低帧率。

**总结：**

实验2和实验3的任务分别从两个方面来进行，实验二是针对机器学习方面（说具体就是完成了图像的分类，构建了分类模型）实验三是针对连接外部硬件（具体就是连接了摄像头，完成了图像采集，并且进行了人脸检测）实验4就是针对性的开始完成最后的实验了