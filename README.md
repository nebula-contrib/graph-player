# graph-player

## Requirements

Cocos Creator 3.8.0
VS code

## 导入项目
1. 将仓库clone到本地
2. 打开cocos Creator,导入该项目
   <img width="708" alt="image" src="https://github.com/ClaireYuj/graph-player/assets/84023218/00606c12-6110-4472-b9be-62d7ecd1f738">

## 测试项目
   ![image](https://github.com/ClaireYuj/graph-player/assets/84023218/ad5f2d96-3861-4573-92de-555fc272c484)
   点击运行
## build项目

### 网页展示

修改graphPlayer中的useServer变量为false，可通过
```typescript


    public getUseServerFlag():boolean{
        return this.useServer;
    }


```

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
