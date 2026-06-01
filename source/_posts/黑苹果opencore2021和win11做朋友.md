---
title: 黑苹果opencore2021和win11做朋友
date: 2021-07-25 22:01:26
tags: 
   - 黑苹果 
   - opencore
categories:
  - 学习呦
toc: false
---
# 2021黑苹果·opencore 0.7.0 macOS BigSur 和 win11做朋友  

这一篇文章我是为了自己做一份装黑果教程的备份，同时发布到Hexo上去。也是给看到这一篇博客的人有一点的帮助吧  

![](https://static.xiaoblogs.cn/img/ZZD7q42.jpeg)

首先请先关注下上面图片的五个货（B站搜索：A-Soul 名字在图片上有） 

<!-- more -->

## 一、逛贴吧、论坛、研究自己的配置、弄个能翻山越岭的网（很多东西都是GitHub下载，慢的要命）  
  
有下面几个问题  
* 知道基本的安装系统，系统如何设置BIOS
* 大概知道黑苹果和装win的不同
* 知道黑苹果相较白苹果体验上会有缺失  
* 你有足够的耐心吗 
* 你会英语吗 
  
你的电脑配置：  
首先，你的电脑是台式机吗？还是笔记本  
+ 台式机：我很赞成去装黑苹果，比笔记本的事情少多了  
+ 笔记本：如果你就是为了去用黑苹果当主力，我建议你去用win11。如果是学习，建议备份好原来系统，之后试一试，最后还是用win
  
之后，了解你的配置（这一点是很重要的，会让你知道你的设备能不能装黑苹果）  
下面会放几个链接，链接到opencore官网，要求你能基本的看个懂，不过我相信我在这里提示链接是干什么的，你打开链接后应该能明白个七七八八  
+ Intel因特尔CPU 和 AMD CPU支持列表：https://dortania.github.io/OpenCore-Install-Guide/macos-limits.html#cpu-support  
+ GPU 显卡支持列表（这里台式机强烈建议去弄一块免驱卡）：https://blog.daliansky.net/Mojave-Hardware-Support-List.html  
+ 主板支持列表：https://dortania.github.io/OpenCore-Install-Guide/macos-limits.html#motherboard-support  
+ 无线网卡支持列表（建议因特尔和博通网卡）：https://post.smzdm.com/p/aekw8844/  
+ 硬盘（三星硬盘注意一下）：https://dortania.github.io/OpenCore-Install-Guide/macos-limits.html#storage-support  

我放下我的配置：  
+ CPU：AMD Ryzen 锐龙 3600  
+ GPU：RX480 XFX OC  
+ 主板：MSI微星 B450m 迫击炮max  
+ 无线网卡：高通 AR 9565  
+ 有线网卡：Realtek Gbyte
+ 硬盘：西数 SN550  

通过上面的链接，如果发现你的配置不符合，我劝你要么换配置，要么win11  

## 二、大概要知道Opencore是什么，里面有那些术语，macOS相关的一些基本知识（启动过程中加载什么东西，启动流程等）  
小百科：https://dortania.github.io/OpenCore-Install-Guide/terminology.html  

## 三、手动做一个usb EFI引导盘  

准备一个 8G 以上的U盘，这一步的目标就是制作一个可以通过U盘引导的macOS安装盘 

两个步骤：
* 通过工具下载镜像
* 直接复制官方EFI文件夹，并剔除一些非必要的文件

1. 使用工具下载macOS镜像  
   先下载[opencore](https://github.com/acidanthera/OpenCorePkg/releases/)
   PS. 其中有两个版本，一个是release一个是debug。刚开始安装建议使用debug版本，会多显示一些安装的debug信息，能帮助你更好的安装系统，定位到错误（一般都是看卡住的代码）
   ![](https://static.xiaoblogs.cn/img/20210727105233.png)  
   进入上图的位置（macrcovery文件夹中），在这个文件夹中我们要用到macrecovery.py这个文件(**必须要安装好python环境**)  
     
   在Windows中，`鼠标右键` + `shift键` 即可以打开shell  
   在打开的shell中，输入下面的命令，来选择你要安装的macOS版本  

        # Lion(10.7):
        python macrecovery.py -b Mac-2E6FAB96566FE58C -m 00000000000F25Y00 download
        python macrecovery.py -b Mac-C3EC7CD22292981F -m 00000000000F0HM00 download

        # Mountain Lion(10.8):
        python macrecovery.py -b Mac-7DF2A3B5E5D671ED -m 00000000000F65100 download

        # Mavericks(10.9):
        python macrecovery.py -b Mac-F60DEB81FF30ACF6 -m 00000000000FNN100 download

        # Yosemite(10.10):
        python macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000GDVW00 download

        # El Capitan(10.11):
        python macrecovery.py -b Mac-FFE5EF870D7BA81A -m 00000000000GQRX00 download

        # Sierra(10.12):
        python macrecovery.py -b Mac-77F17D7DA9285301 -m 00000000000J0DX00 download

        # High Sierra(10.13)
        python macrecovery.py -b Mac-7BA5B2D9E42DDD94 -m 00000000000J80300 download
        python macrecovery.py -b Mac-BE088AF8C5EB4FA2 -m 00000000000J80300 download

        # Mojave(10.14)
        python macrecovery.py -b Mac-7BA5B2DFE22DDD8C -m 00000000000KXPG00 download

        # Catalina(10.15)
        python macrecovery.py -b Mac-00BE6ED71E35EB86 -m 00000000000000000 download

        # Latest version
        # ie. Big Sur(11)
        python macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000000000 download  
    
    输入命令下载完成后如下图  
    ![](https://static.xiaoblogs.cn/img/下载镜像完成.png)  

    在刚才的macrecovery文件夹下，会有两个下载好的文件  
    ![](https://static.xiaoblogs.cn/img/下载镜像的位置.png)  

2. 复制EFI文件夹  
   复制之前，需要使用rufus工具（百度搜索下载或者使用我提供的工具包里有的rufus）  

   格式化U盘  
   ![](https://static.xiaoblogs.cn/img/制作带有efi的启动u盘.png)  
   
   按照上面的图片设置就可以  

   格式化好后，复制下图的`IA32`或`X64`文件夹中的**EFI**文件夹到做好的U盘中去  
   ![](https://static.xiaoblogs.cn/img/20210727113705.png)  

   需要剔除EFI中的一些文件，剔除完成后入下图  
   ![](https://static.xiaoblogs.cn/img/20210727114102.png)  

   ***PS.注意，教程只是针对使用UEFI引导方式、安装的系统为Catalina、BigSur等较为新的系统，以及于较为新的系统。如果你安装的是老系统，老机器。请仔细去官网查看不同***  

   之后，在U盘的根目录创建一个名为`com.apple.recovery.boot`的文件夹  
   把你下载的两个镜像文件复制进去  

   最后你的U盘应该是这样的  
   ![](https://static.xiaoblogs.cn/img/20210727114728.png)  

   不要管上图中EFI文件夹下的Microsoft文件夹，为什么会有那么一个文件夹，到双系统的时候你就明白了

## 四、找驱动（kext文件和Drivers文件夹下的文件）  
简单来说
+ kext：macOS的驱动  
+ Drivers文件夹：Opencore或者Clover需要的驱动  

1. Drivers文件夹下
   
   必要文件：[HfsPlus.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus.efi)、[OpenRuntime.efi](https://github.com/acidanthera/OpenCorePkg/releases)  

   *** PS. 非UEFI的用户请仔细[看这里](https://dortania.github.io/OpenCore-Install-Guide/ktext.html#legacy-users)
   
2. Kexts文件夹下  
   
   这里需要根据自己的电脑硬件配置去选择文件，所以你必须自己根据 [这个教程](https://dortania.github.io/OpenCore-Install-Guide/ktext.html#kexts) 去到 [Kext仓库](http://kexts.goldfish64.com/) 找到自己的驱动  

   所有的驱动都搜集其应该和下面的图片差不多（主要不是一模一样，是差不多）  
   ![](https://static.xiaoblogs.cn/img/20210727121050.png)  

## 五、ACPI文件夹下的SSDT文件的添加  
还是简单的说明下：
+ ACPI：管理电源的一系列接口（包括EC控制器、开关机、唤醒睡眠、电池管理、设备用电管理、性能管理等）

所以说，ACPI文件夹下的文件很重要。对于五花八门的硬件配置，也要用不同的ssdt.aml(ACPI Machine Language Binary)来对硬件修正让macOS能正确的识别  

所以你的任务就是使用一个工具，生成自己电脑的DSDT文件，通过这个DSDT文件，生成（根据下面的图片）所需的SSDT修正文件，之后放到ACPI文件夹即可  
+ 工具：[SSDTime](https://github.com/corpnewt/SSDTTime)

SSDTime是最简单的方法，这个工具根据你的电脑配置会自动的生成一个DSDT文件之后会根据这个DSDT文件生成想要的修正SSDT文件  

---
### 制作SSDT文件基本步骤：  
1. 根据表格找到你的需要的SSDT文件  
   PS. 我仅仅只放一个链接，你必须点进去自己看自己的平台，因为有很多平台的信息，我只放我电脑平台的图片，其他平台类似  
   [各平台所需SSDT表格](https://dortania.github.io/OpenCore-Install-Guide/ktext.html#ssdts)  
   ![这里只是台式机的](https://static.xiaoblogs.cn/img/20210727153905.png)

2. 使用SSDTime工具  
  * 使用工具生成DSDT
  * 在工具中选择生成的DSDT
  * 选择要的SSDT  
  基本就是上面的这几个步骤  
  ![](https://static.xiaoblogs.cn/img/ssdt工具界面.png)  
  上面的图就是SSDTime这个工具了  
  * 选择`8`，自动生成DSDT
  * 选择`D`，选择上一步自动生成的DSDT的路径
  * 选择`1-7`，根据上面的SSDT所需表格或者那个链接里所述的，从1-7中选择自己需要的SSDT  
  eg.  
  我的平台是AMD Ryzen3000系，也就是AMD(17/19h)那一行，主板是B450 => 我需要的SSDT为：SSDT-EC。
  如果是英特尔Intel 8代，那就是需要：SSDT-PLUG、SSDT-EC、SSDT-AWAC、SSDT-PWC  

3. 针对一些配置的说明（重要）  
   SSDTime好用，但是自动生成的一些SSDT修正可能还是会有问题，这个时候需要你手动的去修正。以8代SSDT-AWAC修正为例  
   macOS中需要开启RTC0时钟，需要禁止掉AWAC时钟  
   * 需要使用工具反编译DSDT.aml
   * 打开反编译后的DSDT.dsl  
   * 搜索`PNP0B00`，如果定位到了，说明可以禁止AWAC时钟，会在下面的编辑config.plist中禁止。如果没有定位到，就需要继续往下走
   * 搜索`Name (_ADR, 0x001F0000)`，定位LPC的路径
   * 下载SSDT-RTC0的模板文件
   * 替换`PCI0.LPCB`为`PCI0.LPC`
   * 完成后编译DSDT.dsl为DSDT.aml
   * 使用SSDTime生成SSDT-AWAC文件  
  注意：上面仅仅为一个过程，没有任何原理的描述。简单来讲就是手动的替换设备名字、地址来做修正，更多的修正参加[官网ACPI教程](https://dortania.github.io/Getting-Started-With-ACPI/#a-quick-explainer-on-acpi)

  
## 六、配置config.plist文件  
config.plist是什么：macOS属性配置表  
要修改的属性：  
+ ACPI
+ Booter
+ DeviceProperties
+ Kernel
+ Misc
+ NVRAM
+ PlatformInfo
+ UEFI  
这一步很关键，一个选项配置错误就会导致卡代码，或者安装出错等等问题，耐心一点  

1. 拷贝下载的opencore中的config.plist模板，放到EFI/OC目录下  
![](https://static.xiaoblogs.cn/img/20210727165321.png)
2. 使用 [ProperTree](https://github.com/corpnewt/ProperTree) 编辑刚刚复制的config.plist  
3. 点击下面的链接，根据自己的配置选择对应的config编辑教程  
[不同平台config.plist教程](https://dortania.github.io/OpenCore-Install-Guide/config.plist/#selecting-your-platform)  
---
#### 请认真根据我提供的链接去一个属性一个属性的修改，官网对于要修改的属性对都用红色框标出，并且注明了哪些平台要修改，那些不需要修改。这里我没法把所有平台的教程都写到博客里，但如果写了我的平台如何去编辑config，就会有人完全按照我的config去编辑，这也是不行的。每个人都是独一份的黑苹果，请努力啃一下英文的官网  
---
## 七、BIOS设置  
编辑完自己的config后，都有对应的BIOS设置。注意，一定要确保官网提到的每一个BIOS选项都可以设置，如果某一项BIOS设置找不到，需要考虑去config解锁。如果也没法解锁，可以暂且忽略，但是要看后面的安装部分能不能进入  
  
## 八、格式化硬盘，建立EFI分区  
1. 做一个winPE  
2. 使用一般winPE都有的diskGenius工具，将你要安装的硬盘`删除所有分区`=> `新建分区` => `建立一个200MB的ESP分区` 就可以了，不需要再建立其他分区  

## 九、安装macOS  
1. 插上U盘，在BIOS里选择U盘启动
2. 如果顺利进入下图，就继续走下面的步骤，否则就去检查代码，改config或者设置BIOS  
![](https://static.xiaoblogs.cn/img/macos恢复界面.png)
3. 选择`磁盘工具`，选择你上一步格式化的磁盘，点击`抹掉`，格式选择`APFS`
![](https://static.xiaoblogs.cn/img/macos磁盘工具格式化磁盘.png)
4. 好了，关掉磁盘工具，选择`重新安装macOS Big Sur`
---

# 安装完macOS强烈建议做的一些事情  
## ① 摆脱U盘，直接从硬盘的EFI启动macOS  
PS. 如果你说我插U盘启动也没关系，那可以跳过  
1. `command`（win徽标键） + `空格` 打开聚焦搜索，搜索Terminal终端
2. 使用 `sudo diskutil list` 命令查找EFI盘标识符  
![](https://static.xiaoblogs.cn/img/20210727174107.png)  
我的盘的EFI标识符为：disk0s1
3. 使用 `sudo diskutil mount ${diskID}` ，${diskID}为你自己的EFI分区标识符，要替换  
4. 上面命令挂载出了我们本机的EFI文件夹  
![](https://static.xiaoblogs.cn/img/20210727174354.png)
5. 之后，把 **U盘** 的EFI文件夹复制进刚刚 **挂载的EFI盘下**  
![](https://static.xiaoblogs.cn/img/20210727174551.png)  

这样以后就不需要插U盘启动了  

## ② 安装win11  
前提：  
+ 强烈建议，win11安装到一个盘，macOS安装到一个盘（日常使用速度慢不了多少）  
+ win11 在 2021年7月份还需要DEV的微软账号才可以安装，且必须先安装win10之后在更新中升级到DEV版本

我的win11安装在sata的固态上，macOS是nvme  

1. 使用winPE删除要安装的win盘的所有分区  
2. 使用提前用易升，或者是rufus制作的win安装U盘  
3. win安装时选择 win盘就可以了
4. win11的升级需要开启主板的TPM(我的是msi微星主板)  
  
![](https://static.xiaoblogs.cn/img/win11tpm.png)

---
上面的情况是两块盘安装系统，win不会覆盖我们opencore的EFI  

### 如果是一块硬盘，请根据下面的链接完成  
[一块硬盘安装双系统](https://dortania.github.io/OpenCore-Multiboot/empty/samedisk.html#precautions)  
PS.简单描述：使用macOS的恢复模式中的磁盘工具，划分出来一个区给win来安装  

## ③ 升级系统  
每一次小的系统升级，还是打的系统升级。都有可能导致原有的补丁，驱动等失效，升级需要谨慎。建议先去贴吧、论坛等看一看别人升级是否有问题  

基本步骤：  
+ 更新opencore，替换EFI文件夹下的opencore核心文件  
+ 更新驱动，去驱动仓库查看
+ macOS的 `系统偏好设置` 中更新

## ④ 引导盘选择界面美化  
成品如下：  
![](https://static.xiaoblogs.cn/img/启动选项完成图.png)  

准备的资源：  
+ [Binary Resources](https://github.com/acidanthera/OcBinaryData) 启动界面的图片资源，音频资源等  
+ [OpenCanopy.efi](https://github.com/acidanthera/OpenCorePkg/releases) 放到 `Drivers` 文件夹下  

1. 将下载好的Binary Resources解压后的 `Resources` 文件夹放到引导盘的 `EFI/OC` 文件夹下  
![](https://static.xiaoblogs.cn/img/20210727181448.png)
2. 使用PropreTree工具修改config.plist  
  + Misc属性 -> Boot -> PickerMode: External
  ![](https://static.xiaoblogs.cn/img/20210727181742.png)
  + Misc属性 -> Boot -> PickerAttributes: 17  
  ![](https://static.xiaoblogs.cn/img/20210727181832.png)
  + Misc -> Boot -> PickerVariant: Acidanthera\GoldenGate([官网有三种主题](https://dortania.github.io/OpenCore-Post-Install/cosmetic/gui.html#setting-up-opencore-s-gui))  

---
### 总结
这是第二次写OC的教程了，上次教程的配置是i7 6700 + H170m + rx480。这次发现，A+A的配置更简单。如果你的配置和我一样，可以用我的EFI  
+ [我的EFI](https://github.com/MIMONATCH/ryzen3600-rx480-B450m-opencoreEFI)
