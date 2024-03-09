import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res
    .status(200)
    .json({
      companies: [
        {
          id: 1,
          name: "Test Company",
        },
      ],
    })
    .end();
  return;
});

export default router;
