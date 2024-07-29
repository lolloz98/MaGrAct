# MaGrAct - Mathematical Graphic Action


Welcome, MaGrAct wants to be a tool to create beautiful maths related animations. 

The inspiration for this tool derives from [Manim](https://github.com/3b1b/manim). Even though, MaGrAct is still in very early stages and still not ready for a production environment, I think it's already a cool tool and might be useful for some prototyping.

The idea is that it would be amazing to have a GUI with similar functionalities as Manim, with an easier learning curve and no (or minimal) setup.

## Performance
As of now, performance has not been in my mind. The tool was developed in under a month and will be submitted to [SoMe](https://some.3b1b.co/). 

I had to make some cut on what to do. 

For example, there are some very easy performance gains to get from using `useMemo` functions in the `graphic` section, but they are yet to be implemented.

## Contributing
Since I have been doing this in spare time, I am not sure of how much I will be able to maintain and progress the tool. If you want to contribute, you are more than welcome to open PRs in github.

Let's try not to make the code too hacked... PRs that are clear anti-patterns (in a bad way), or break some of the core functionalities will not be accepted.

## TODOs
I will probably open issues for this, but it would be great to:
- have an export that export the animation to video (for this I already created a branch with minimal Electron setup => we need proper access to the file system. It should be fairly straight forward to implement by saving each frame as an image, konva already has this functionality, and then using [ffmpge.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) to render the video)
- recording audio
- setting up a proper test suite (!!!)

## License
License it's MIT. If you like this project, it would be amazing to get a star on the repo `:)`.

## Issues
If you find any issues please raise it on this repo. You are more than welcome to work on a PR to fix it