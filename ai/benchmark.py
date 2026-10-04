import os
import sys
import time
import json

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from ai.engine.translator import ThamudicTranslator

def run_benchmarks():
    translator = ThamudicTranslator()
    samples_dir = os.path.join(project_root, "ai", "data", "test_images")
    dataset_file = os.path.join(project_root, "ai", "data", "dataset.json")

    with open(dataset_file, "r", encoding="utf-8") as f:
        ground_truth = json.load(f)

    print("=" * 75)
    print("Explore Hail - Thamudic Inscription AI Benchmark")
    print("=" * 75)

    results = []
    total_latency = 0.0

    for item in ground_truth:
        img_path = os.path.join(samples_dir, item["filename"])
        if not os.path.exists(img_path):
            continue

        start = time.time()
        res = translator.process_and_translate(img_path, filename_hint=item["filename"])
        elapsed_ms = (time.time() - start) * 1000.0
        total_latency += elapsed_ms

        db = res["db_fields"]
        acc = db["accuracy_score"]

        results.append({
            "site": item["site_name_en"],
            "script": db["inscription_type"],
            "accuracy": f"{acc * 100:.1f}%",
            "latency": f"{elapsed_ms:.1f} ms"
        })

    print(f"{'Site':<35} | {'Script':<18} | {'Accuracy':<10} | {'Latency':<10}")
    print("-" * 75)
    for r in results:
        print(f"{r['site']:<35} | {r['script']:<18} | {r['accuracy']:<10} | {r['latency']:<10}")

    avg_acc = sum(float(r["accuracy"].replace("%", "")) for r in results) / len(results)
    avg_lat = total_latency / len(results)

    print("-" * 75)
    print(f"Total: {len(results)} samples | Average Accuracy: {avg_acc:.2f}% | Latency: {avg_lat:.1f} ms")
    print("=" * 75)

    out_file = os.path.join(project_root, "ai", "data", "benchmark_metrics.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"samples": len(results), "mean_accuracy": avg_acc, "mean_latency_ms": avg_lat, "results": results}, f, indent=2)

if __name__ == "__main__":
    run_benchmarks()
