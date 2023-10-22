# graph-player
相比于传统的关系型数据库，图数据库通过提供图模型、灵活的关系表示和高效的查询等功能，为处理和分析复杂关系的数据提供了一种强大的工具。由于图数据库优秀的可视化能力，在复杂条件下清晰展现了数据间的关系，提高了数据处理效率。而游戏，作为一种将信息传达和交互操作融合的媒介，要求简洁明了的信息展示与简单易懂的操作。本项目将基于游戏引擎，研究游戏思维与图数据处理的结合，并期望挖掘两者之间的可能。
## Requirements

- Cocos Creator 3.8.0

- VS code


## 导入项目
1. 将仓库clone到本地


2. 打开cocos Creator,导入该项目
   <img width="708" alt="image" src="https://github.com/ClaireYuj/graph-player/assets/84023218/00606c12-6110-4472-b9be-62d7ecd1f738">

## 测试项目
   ![image](https://github.com/ClaireYuj/graph-player/assets/84023218/ad5f2d96-3861-4573-92de-555fc272c484)
   点击运行按钮，进行本地测试

## build项目

### 网页展示
网页展示在无需连接远程服务器与数据库的情况下，可展示demo
修改graphPlayer中的useServer变量为false，可通过
```typescript

    public getUseServerFlag():boolean{
        return this.useServer;
    }


```

在输入框中输入数据集名称进行测试，开放sns与nba两种数据集可供测试。
```ngql
   use nba;
```

```ngql
   use sns;
```

点击layout按钮，可按照tag进行排列

### 连接服务器
   <img width="1123" alt="image" src="https://github.com/ClaireYuj/graph-player/assets/84023218/433cdb87-ec09-4e77-8408-637bbaa12e39">
将项目build到网页端
修改graphPlayer中的useServer变量为true，可通过

```typescript
    public getUseServerFlag():boolean{
        return this.useServer;
    }
```

  如果要修改服务器地址，选择graphPlayer.ts, 修改serverAddress变量

```typescript
    public changeServerAddress(address:string):string{
        this.serverAddress = address;
        return address;
    }
```
